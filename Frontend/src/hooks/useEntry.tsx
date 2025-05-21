import { useState } from 'react';
import { getCurrentDate } from '../utils/dateUtils';
import { generateUid } from '../utils/generateUid';
import { Annotation } from './useAnnotation';

const useEntry = (initialEntries: Entry[]) => {

  const generateEntry = (number: number) => ({
    entry_number: number,
    entry_date: getCurrentDate(),
    entry_uid: generateUid(),
    annotations: [],
  });

  const [entries, setEntries] = useState<Entry[]>(initialEntries.length ? initialEntries : [generateEntry(1)]);

  const addEntry = () => setEntries(prevEntries => [...prevEntries, generateEntry(entries.length + 1)]);

  const updateEntry = (entryUid: string, newProps: Partial<Entry>) => {
    setEntries(prevEntries =>
      prevEntries.map(entry =>
        entry.entry_uid === entryUid
          ? { ...entry, ...newProps }
          : entry
      )
    );
  };

  const deleteEntry = (entryUid: string) => setEntries(entries.filter(entry => entry.entry_uid !== entryUid));

  const clearEntries = () => setEntries([generateEntry(1)]);

  return {
    entries,
    addEntry,
    updateEntry,
    deleteEntry,
    clearEntries,
  }
}

type Entry = {
  entry_number: number,
  entry_date: string,
  entry_uid: string,
  annotations: Annotation[],
}

export default useEntry
