import { useState, useEffect, useRef } from 'react';
import http from '../http-common';

export default function useAccountSelector() {
  const [accounts, setAccounts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const loadAccounts = () => {
    http
      .get(`/accounts?page=${currentPage}&per_page=5&search=${searchQuery}`)
      .then((response) => {
        setAccounts(response.data.accounts);
        setTotalPages(response.data.meta.total_pages || 1);
      })
      .catch((error) => {
        setAccounts([]);
        console.error('Error al cargar las cuentas: ', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadAccounts();
  }, [searchQuery, currentPage]);

  const safeSetCurrentPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  return {
    accounts,
    setAccounts,
    loadAccounts,
    searchQuery,
    setSearchQuery,
    handleSearchChange,
    currentPage,
    setCurrentPage: safeSetCurrentPage,
    totalPages,
    isLoading,
    setIsLoading,
  };
}
