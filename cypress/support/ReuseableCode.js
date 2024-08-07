
export class ReuseableCode {

  getRandomNumber(min, max) {
    // Use Math.random() to generate a random decimal between 0 and 1
    // Multiply by the range (max - min + 1) and add min to shift the range
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  generateRandomString(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }
    return randomString;
  }

  getRandomFirstName() {
    let firstNames = ['Alice', 'Bob', 'Charlie', 'David', 'Emma', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack', 'Katherine', 'Liam', 'Mia', 'Noah', 'Olivia', 'Peyton', 'Quinn', 'Ryan', 'Sophia'];
    let randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    // Remove double quotes from the string
    const firstNameWithoutQuotes = randomFirstName.replace(/"/g, '');
    return firstNameWithoutQuotes
  }

  getRandomLastName() {
    const lastNames = ['Johnson', 'Smith', 'Williams', 'Davis', 'Miller', 'Wilson', 'Moore', 'Anderson', 'Thomas', 'Harris', 'Lee', 'Garcia', 'Martinez', 'Brown', 'Jones', 'Jackson', 'Taylor', 'White', 'Clark', 'Young'];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    // Remove double quotes from the string
    const lastNameWithoutQuotes = randomLastName.replace(/"/g, '');
    return lastNameWithoutQuotes;
  }

  getRandomPhoneNumber() {
    // Generate a random 10-digit number
    const randomDigits = Math.floor(1000000 + Math.random() * 9000000);

    // Format the number as a phone number without the '+'
    const formattedPhoneNumber = `313${randomDigits}`;

    return formattedPhoneNumber;
  }

}
