import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from './LoginPage';  // Adjust the import based on your file structure
import '@testing-library/jest-dom/extend-expect';

jest.mock('crypto-js', () => ({
  SHA256: jest.fn(() => ({
    toString: jest.fn(() => 'hashedpassword'),
  })),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    render(<LoginPage />);
  });

  test('shows an alert when username or password is empty', async () => {
    // Mock alert to prevent it from interrupting the test
    window.alert = jest.fn();

    // Get the username and password fields
    const usernameInput = screen.getByPlaceholderText('Felhasználónév');
    const passwordInput = screen.getByPlaceholderText('Jelszó');
    const loginButton = screen.getByText('Bejelentkezés');

    // Fire the login button click with empty inputs
    fireEvent.change(usernameInput, { target: { value: '' } });
    fireEvent.change(passwordInput, { target: { value: '' } });
    fireEvent.click(loginButton);

    // Check if alert was called with "User not found!" when the username is empty
    expect(window.alert).toHaveBeenCalledWith('User not found!');
  });
});