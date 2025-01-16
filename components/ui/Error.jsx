import { useRouter } from "next/navigation";
import { BiHome, BiError } from "react-icons/bi";

const Error = ({ errorCode, errorMessage }) => {
  const router = useRouter();

  const getErrorTitle = () => {
    switch (errorCode) {
      case 404:
        return "404";
      case 500:
        return "500";
      case 403:
        return "403";
      default:
        return errorCode;
    }
  };

  const getDefaultErrorMessage = () => {
    switch (errorCode) {
      case 404:
        return "Oops! Page not found.";
      case 500:
        return "Internal server error.";
      case 403:
        return "Access denied.";
      default:
        return errorMessage;
    }
  };

  const handleRefresh = () => {
    window.location.reload(); // Reloads the page
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 text-center">
      <h1 className="text-9xl md:text-[10rem] font-extrabold">
        {getErrorTitle()}
      </h1>
      <p className="text-2xl ">{getDefaultErrorMessage()}</p>
      <p className="mb-6 max-w-md">{errorMessage}</p>

      {errorCode === 500 ? (
        <button
          onClick={handleRefresh}
          className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <BiError className="mr-2 h-4 w-4" />
          Refresh
        </button>
      ) : (
        <button
          onClick={() => router.push("/")}
          className="flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 dark:hover:bg-primary/90 transition-colors"
        >
          <BiHome className="mr-2 h-4 w-4" />
          Go Home
        </button>
      )}
    </div>
  );
};

export default Error;
