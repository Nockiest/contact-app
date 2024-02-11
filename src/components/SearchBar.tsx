

import searchIcon from "../assets/search.svg";
import "../App.css";
import { useContactContext } from "../Context";

type AutocompleteSearchBarParamas = {

};
const AutocompleteSearchBar: React.FC<AutocompleteSearchBarParamas> = () => {
  const { query, setQuery } = useContactContext();

  return (
    <div
      style={{
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        width: "300px",
        display: "flex",
        justifyContent: "start",
        gap: "0.5em",
        alignItems: "center",
        margin: "auto",

        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
      }}
    >
      <img src={searchIcon} alt="looking-glass" height={16} width={16} />

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          border: "none",
           
          width: '100%'
        }}
      />
    </div>
  );
};

export default AutocompleteSearchBar;
