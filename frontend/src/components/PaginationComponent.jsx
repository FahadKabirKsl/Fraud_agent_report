// PaginationComponent.js
import React from "react";
import { Pagination } from "react-bootstrap";

const CustomPagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => onPageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }
    return pageNumbers;
  };

  return (
    <Pagination className="d-flex justify-content-center">
      {renderPageNumbers()}
    </Pagination>
  );
};

export default CustomPagination;
