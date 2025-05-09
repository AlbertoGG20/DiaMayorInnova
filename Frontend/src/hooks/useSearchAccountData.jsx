import { useEffect, useState } from "react";
import AccountService from "../services/AccountService";
import HelpExampleService from "../services/HelpExampleService";

const useSearchAccountData = (searchNumber) => {
  const [example, setExample] = useState({});
  const [account, setAccount] = useState({});
  const [solution, setSolution] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false)
  const [isData, setIsData] = useState(false)

  const fetchData = async () => {
    if (searchNumber.length >= 4) {
      try {
        setIsLoading(true);
        setIsError(false);

        const accountData = await AccountService.findByNumber(searchNumber);
        setAccount(accountData.data);

        const accountExampledata = await HelpExampleService.findByAccount(accountData.data.id)
        setExample(accountExampledata.data);

        // La solución ya viene incluida en la respuesta del HelpExample
        if (accountExampledata.data.solution) {
          setSolution(accountExampledata.data.solution);
        }

        setIsLoading(false);
        setIsData(true);
      }

      catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
        setIsError(true);
        setIsData(false);
      }
    }
  }

  useEffect(() => {
    fetchData();
  }, [searchNumber])

  return {
    isLoading,
    isError,
    example,
    account,
    solution,
    isData,
  }
}

export default useSearchAccountData;
