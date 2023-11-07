export default function generateStrongPassword() {
    const symbols = '!@#$%^&*_+|?';
    const capitalLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const regularLetters = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
  
    // Initialize the password with one character from each category
    let password = '';
    password += symbols[Math.floor(Math.random() * symbols.length)];
    password += capitalLetters[Math.floor(Math.random() * capitalLetters.length)];
    password += regularLetters[Math.floor(Math.random() * regularLetters.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
  
    // Fill the remaining characters with a mix of all categories
    const allCharacters = symbols + capitalLetters + regularLetters + numbers;
    for (let i = 4; i < 10; i++) {
      const randomChar = allCharacters[Math.floor(Math.random() * allCharacters.length)];
      password += randomChar;
    }
  
    // Shuffle the password to make it more random
    password = password.split('');
    for (let i = password.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [password[i], password[j]] = [password[j], password[i]];
    }
    
    return password.join('');
  }
  