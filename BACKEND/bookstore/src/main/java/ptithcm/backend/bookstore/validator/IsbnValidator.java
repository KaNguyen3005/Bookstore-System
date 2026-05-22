package ptithcm.backend.bookstore.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class IsbnValidator implements ConstraintValidator<ValidIsbn, String> {

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isBlank()) {
            return true;
        }

        String isbn = value.replaceAll("[\\s-]", "").toUpperCase();
        if (isbn.length() == 10) {
            return isValidIsbn10(isbn);
        }
        if (isbn.length() == 13) {
            return isValidIsbn13(isbn);
        }
        return false;
    }

    private boolean isValidIsbn10(String isbn) {
        if (!isbn.matches("\\d{9}[\\dX]")) {
            return false;
        }

        int sum = 0;
        for (int i = 0; i < 9; i++) {
            sum += (isbn.charAt(i) - '0') * (10 - i);
        }

        char checkChar = isbn.charAt(9);
        int checkDigit = checkChar == 'X' ? 10 : checkChar - '0';
        sum += checkDigit;

        return sum % 11 == 0;
    }

    private boolean isValidIsbn13(String isbn) {
        if (!isbn.matches("97[89]\\d{10}")) {
            return false;
        }

        int sum = 0;
        for (int i = 0; i < 12; i++) {
            int digit = isbn.charAt(i) - '0';
            sum += i % 2 == 0 ? digit : digit * 3;
        }

        int checkDigit = (10 - (sum % 10)) % 10;
        return checkDigit == isbn.charAt(12) - '0';
    }
}
