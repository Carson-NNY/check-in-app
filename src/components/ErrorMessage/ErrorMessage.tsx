import style from "./ErrorMessage.module.css";

type ErrorMessageProps = {
  error: string | null;
  setError: (error: string | null) => void;
};

export default function ErrorMessage({ error, setError }: ErrorMessageProps) {
  return (
    <>
      {error && (
        <div className={style.errorMessage}>
          {error}{" "}
          <button
            style={{
              marginTop: "15px",
              marginBottom: "15px",
              marginLeft: "10px",
            }}
            onClick={() => setError(null)}
          >
            Reset Error
          </button>
        </div>
      )}
    </>
  );
}
