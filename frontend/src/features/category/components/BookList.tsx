import ProductCard from '../../product/components/ProductCard';
import type { Book } from '../types/category';

interface BookListProps {
  books: Book[];
  loading: boolean;
  error: string | null;
}

const BookList = ({ books, loading, error }: BookListProps) => {
  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Đang tải danh sách sách...</div>;
  }

  if (error) {
    return <div style={{ padding: '40px', color: 'red', textAlign: 'center' }}>{error}</div>;
  }

  if (books.length === 0) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: '#666', border: '1px dashed #ddd', borderRadius: '12px' }}>
        <h3>Không tìm thấy sách phù hợp</h3>
        <p>Vui lòng điều chỉnh lại bộ lọc để tìm thấy nhiều kết quả hơn.</p>
      </div>
    );
  }

  return (
    <div className="category-page__grid">
      {books.map((book) => (
        <ProductCard key={book.bookId} book={book as any} />
      ))}
    </div>
  );
};

export default BookList;
