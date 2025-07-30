import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import NewsletterSignup from '../NewsletterSignup'

describe('NewsletterSignup Component', () => {
  beforeEach(() => {
    // Reset fetch mock
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('renders newsletter signup form', () => {
    render(<NewsletterSignup />)
    
    expect(screen.getByText('Subscribe to Newsletter')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Your email address')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument()
  })

  test('allows user to type in email field', async () => {
    const user = userEvent.setup()
    render(<NewsletterSignup />)
    
    const emailInput = screen.getByPlaceholderText('Your email address')
    await user.type(emailInput, 'test@example.com')
    
    expect(emailInput).toHaveValue('test@example.com')
  })

  test('allows user to type in name fields', async () => {
    const user = userEvent.setup()
    render(<NewsletterSignup />)
    
    const firstNameInput = screen.getByPlaceholderText('First Name')
    const lastNameInput = screen.getByPlaceholderText('Last Name')
    
    await user.type(firstNameInput, 'John')
    await user.type(lastNameInput, 'Doe')
    
    expect(firstNameInput).toHaveValue('John')
    expect(lastNameInput).toHaveValue('Doe')
  })

  test('prevents submission with empty email', async () => {
    const user = userEvent.setup()
    render(<NewsletterSignup />)
    
    const submitButton = screen.getByRole('button', { name: /subscribe/i })
    
    await user.click(submitButton)
    
    // Should not make API call
    expect(global.fetch).not.toHaveBeenCalled()
  })

  test('validates email format', async () => {
    const user = userEvent.setup()
    render(<NewsletterSignup />)
    
    const emailInput = screen.getByPlaceholderText('Your email address')
    const submitButton = screen.getByRole('button', { name: /subscribe/i })
    
    await user.type(emailInput, 'invalid-email')
    await user.click(submitButton)
    
    // HTML5 validation should prevent submission
    expect(global.fetch).not.toHaveBeenCalled()
  })

  test('submits form with valid email only', async () => {
    const user = userEvent.setup()
    
    // Mock successful API response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Successfully subscribed!' }),
    })
    
    render(<NewsletterSignup />)
    
    const emailInput = screen.getByPlaceholderText('Your email address')
    const submitButton = screen.getByRole('button', { name: /subscribe/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/email-signup/',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
            first_name: '',
            last_name: '',
            source: 'website'
          }),
        })
      )
    })
  })

  test('submits form with all fields filled', async () => {
    const user = userEvent.setup()
    
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Successfully subscribed!' }),
    })
    
    render(<NewsletterSignup />)
    
    const emailInput = screen.getByPlaceholderText('Your email address')
    const firstNameInput = screen.getByPlaceholderText('First Name')
    const lastNameInput = screen.getByPlaceholderText('Last Name')
    const submitButton = screen.getByRole('button', { name: /subscribe/i })
    
    await user.type(emailInput, 'john.doe@example.com')
    await user.type(firstNameInput, 'John')
    await user.type(lastNameInput, 'Doe')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/email-signup/',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            email: 'john.doe@example.com',
            first_name: 'John',
            last_name: 'Doe',
            source: 'website'
          }),
        })
      )
    })
  })

  test('shows success message after successful submission', async () => {
    const user = userEvent.setup()
    
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Successfully subscribed to newsletter!' }),
    })
    
    render(<NewsletterSignup />)
    
    const emailInput = screen.getByPlaceholderText('Your email address')
    const submitButton = screen.getByRole('button', { name: /subscribe/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Successfully subscribed to newsletter!')).toBeInTheDocument()
    })
  })

  test('clears form after successful submission', async () => {
    const user = userEvent.setup()
    
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Successfully subscribed!' }),
    })
    
    render(<NewsletterSignup />)
    
    const emailInput = screen.getByPlaceholderText('Your email address')
    const firstNameInput = screen.getByPlaceholderText('First Name')
    const submitButton = screen.getByRole('button', { name: /subscribe/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(firstNameInput, 'Test')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(emailInput).toHaveValue('')
      expect(firstNameInput).toHaveValue('')
    })
  })

  test('shows loading state during submission', async () => {
    const user = userEvent.setup()
    
    // Mock delayed response
    global.fetch = jest.fn().mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          json: async () => ({ message: 'Successfully subscribed to newsletter!' }),
        }), 100)
      )
    )
    
    render(<NewsletterSignup />)
    
    const emailInput = screen.getByPlaceholderText('Your email address')
    const submitButton = screen.getByRole('button', { name: /subscribe/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.click(submitButton)
    
    // Should show loading state
    expect(screen.getByText(/subscribing.../i)).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
    
    // Wait for completion
    await waitFor(() => {
      expect(screen.getByText('Successfully subscribed to newsletter!')).toBeInTheDocument()
    })
  })

  test('shows error message for duplicate email', async () => {
    const user = userEvent.setup()
    
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        email: ['This email is already subscribed.']
      }),
    })
    
    render(<NewsletterSignup />)
    
    const emailInput = screen.getByPlaceholderText('Your email address')
    const submitButton = screen.getByRole('button', { name: /subscribe/i })
    
    await user.type(emailInput, 'existing@example.com')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/already subscribed/i)).toBeInTheDocument()
    })
  })

  test('shows generic error for server errors', async () => {
    const user = userEvent.setup()
    
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
    })
    
    render(<NewsletterSignup />)
    
    const emailInput = screen.getByPlaceholderText('Your email address')
    const submitButton = screen.getByRole('button', { name: /subscribe/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Network error/i)).toBeInTheDocument()
    })
  })

  test('shows network error message', async () => {
    const user = userEvent.setup()
    
    global.fetch = jest.fn().mockRejectedValueOnce(new Error('Network error'))
    
    render(<NewsletterSignup />)
    
    const emailInput = screen.getByPlaceholderText('Your email address')
    const submitButton = screen.getByRole('button', { name: /subscribe/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Network error/i)).toBeInTheDocument()
    })
  })

  test('allows retry after error', async () => {
    const user = userEvent.setup()
    
    // Mock initial failure then success
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Successfully subscribed to newsletter!' }),
      })
    
    render(<NewsletterSignup />)
    
    const emailInput = screen.getByPlaceholderText('Your email address')
    const submitButton = screen.getByRole('button', { name: /subscribe/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.click(submitButton)
    
    // Wait for error
    await waitFor(() => {
      expect(screen.getByText(/Network error/i)).toBeInTheDocument()
    })
    
    // Try again
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Successfully subscribed to newsletter!')).toBeInTheDocument()
    })
  })

  test('handles form submission with Enter key', async () => {
    const user = userEvent.setup()
    
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Successfully subscribed to newsletter!' }),
    })
    
    render(<NewsletterSignup />)
    
    const emailInput = screen.getByPlaceholderText('Your email address')
    
    await user.type(emailInput, 'test@example.com')
    await user.keyboard('{Enter}')
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled()
    })
  })

  test('trims whitespace from inputs', async () => {
    const user = userEvent.setup()
    
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Successfully subscribed to newsletter!' }),
    })
    
    render(<NewsletterSignup />)
    
    const emailInput = screen.getByPlaceholderText('Your email address')
    const firstNameInput = screen.getByPlaceholderText('First Name')
    const submitButton = screen.getByRole('button', { name: /subscribe/i })
    
    await user.type(emailInput, '  test@example.com  ')
    await user.type(firstNameInput, '  John  ')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify({
            email: 'test@example.com',
            first_name: 'John',
            last_name: '',
            source: 'website'
          }),
        })
      )
    })
  })

  test('focuses email input on load', () => {
    render(<NewsletterSignup />)
    
    const emailInput = screen.getByPlaceholderText('Your email address')
    expect(emailInput).toHaveFocus()
  })

  test('maintains form state during loading', async () => {
    const user = userEvent.setup()
    
    // Mock delayed response
    global.fetch = jest.fn().mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          json: async () => ({ message: 'Successfully subscribed to newsletter!' }),
        }), 50)
      )
    )
    
    render(<NewsletterSignup />)
    
    const emailInput = screen.getByPlaceholderText('Your email address')
    const firstNameInput = screen.getByPlaceholderText('First Name')
    const submitButton = screen.getByRole('button', { name: /subscribe/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(firstNameInput, 'John')
    await user.click(submitButton)
    
    // During loading, form should maintain values but be disabled
    expect(emailInput).toHaveValue('test@example.com')
    expect(firstNameInput).toHaveValue('John')
    expect(emailInput).toBeDisabled()
    expect(firstNameInput).toBeDisabled()
    expect(submitButton).toBeDisabled()
    
    // Wait for completion
    await waitFor(() => {
      expect(screen.getByText('Successfully subscribed to newsletter!')).toBeInTheDocument()
    })
  })
}) 