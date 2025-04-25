export const SearchBar = ({ value, handleSearchChange }) => {
  return (
    <form className="search-bar">
      <input
        className="search-bar_search"
        type="text"
        value={value}
        onChange={(e) => handleSearchChange(e.target.value)}
        placeholder="Buscar por nombre"
      />
      <i className="fi fi-rr-search"></i>
    </form>
  );
};
