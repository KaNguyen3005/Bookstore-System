package ptithcm.backend.bookstore.enums;

public enum InteractEventType {
    VIEW_BOOK(1),
    ADD_TO_CART(3),
    PURCHASE(8),
    REVIEW(5);

    private final int score;

    InteractEventType(int score) {
        this.score = score;
    }

    public int getScore() {
        return score;
    }
}