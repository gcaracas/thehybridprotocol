import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Test Setup', () => {
  test('testing environment is working', () => {
    expect(true).toBe(true);
  });

  test('jest-dom matchers are available', () => {
    const element = document.createElement('div');
    element.textContent = 'Hello World';
    document.body.appendChild(element);
    
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('Hello World');
    
    document.body.removeChild(element);
  });
}); 