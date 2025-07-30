import '@testing-library/jest-dom'

// Mock environment variables for tests
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8000'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn().mockImplementation(() => Promise.resolve()),
    replace: jest.fn().mockImplementation(() => Promise.resolve()),
    prefetch: jest.fn().mockImplementation(() => Promise.resolve()),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => '/',
  notFound: jest.fn(),
}))

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // Extract Next.js specific props that shouldn't go to img element
    const { 
      fill, 
      quality, 
      priority, 
      placeholder, 
      blurDataURL,
      loader,
      unoptimized,
      onLoad,
      onError,
      ...imgProps 
    } = props;
    
    // Convert Next.js props to standard img props
    if (fill) {
      imgProps.style = { 
        ...imgProps.style, 
        width: '100%', 
        height: '100%', 
        objectFit: 'cover' 
      };
    }
    
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt="" {...imgProps} />
  },
}))

// Mock Next.js Link component
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }) => {
    return (
      <a 
        href={href} 
        onClick={(e) => {
          // Prevent actual navigation in tests
          e.preventDefault();
          if (props.onClick) props.onClick(e);
        }}
        {...props}
      >
        {children}
      </a>
    )
  },
}))

// Mock fetch globally
global.fetch = jest.fn()

// Reset all mocks between tests
beforeEach(() => {
  jest.clearAllMocks()
})

// jest-dom matchers are automatically available via the import at the top

// Suppress console errors during tests (optional)
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (typeof args[0] === 'string') {
      // Suppress common test-related warnings that don't affect functionality
      if (
        args[0].includes('Warning: ReactDOM.render is no longer supported') ||
        args[0].includes('Received `true` for a non-boolean attribute') ||
        args[0].includes('Warning: validateDOMNesting') ||
        args[0].includes('An update to') ||
        args[0].includes('not wrapped in act(') ||
        args[0].includes('async Client Component') ||
        args[0].includes('A component suspended inside an `act` scope')
      ) {
        return
      }
    }
    
    // Suppress JSDOM navigation errors during tests
    if (
      args[0] && 
      typeof args[0] === 'object' && 
      args[0].message && 
      args[0].message.includes('Not implemented: navigation')
    ) {
      return
    }
    
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
}) 