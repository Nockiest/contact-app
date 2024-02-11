interface AlphabetColumnProps {
  setSelectedLetter: (letter: string) => void;
}

const AlphabetColumn: React.FC<AlphabetColumnProps> = ({
  setSelectedLetter,
}) => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  return (
    <div
      style={{
        display: "flex",
        cursor: "pointer",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
        alignItems: "stretch",
      }}
    >
      {alphabet.split("").map((letter) => (
        <div
          key={letter}
          onClick={() => {
            setSelectedLetter(letter);
          }}
          style={{
            textAlign: "center",
            fontSize: "0.5rem",
            borderBottom: "1px solid black",
            padding: "0px 2px",
          }}
        >
          {letter}
        </div>
      ))}
    </div>
  );
};

export default AlphabetColumn;
