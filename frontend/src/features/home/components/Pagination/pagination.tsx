import React from "react";
import styles from "./pagination.module.css";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

type Props = {
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
};

const Pagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
}: Props) => {
  if (totalPages <= 1) return null;

  return (
    <div className={styles.paginationWrapper}>
      <div className={styles.pagination}>
        <button
          className={styles.pageArrowBtn}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
        >
          <FiChevronLeft size={20} />
        </button>

        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            className={`${styles.pageBtn} ${
              currentPage === i + 1
                ? styles.pageBtnActive
                : ""
            }`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          className={styles.pageArrowBtn}
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
        >
          <FiChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;