import { useState } from "react";
import { getCurrentDate } from "../utils/dateUtils";

const useEntry = () => {
  const generateUid = () => `id-${Math.random().toString(32).substr(2, 9)}`;
  
  const [entries, setEntries] = useState([{
    entry_number: 1,
    entry_date: getCurrentDate(),
    entry_uid: generateUid(),
  }]);


  const addEntry = () => {
    const defaultEntry = {
      entry_number: entries.length + 1,
      entry_date: getCurrentDate(),
      entry_uid: generateUid(),
    }
    setEntries([...entries, defaultEntry])
  }

  const removeEntry = (entryUid) => {
    const updatedEntries = entries.filter(entry => entry.entry_uid !== entryUid);
    setEntries(updatedEntries);
  };

  return {
    addEntry,
    removeEntry,
    entries,
  }
}

export default useEntry
