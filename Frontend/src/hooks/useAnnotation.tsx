import { useState } from 'react';
import { generateUid } from '../utils/generateUid';

const useAnnotation = (initialAnnotations) => {

    const generateAnnotation = (number: number, entryUid: string) => ({
      number,
      student_entry_uid: entryUid,
      account_id: 1,
      account_number: '',
      debit: '',
      credit: '',
      uid: generateUid(),
    });

  const [annotations, setAnnotations] = useState<Annotation[]>(initialAnnotations ?? []);

  const addAnnotation = (entryUid: string) => {
    const entryAnnotations = annotations.filter(annotation => annotation.student_entry_uid === entryUid);
    setAnnotations(prevAnnotations => [...prevAnnotations, generateAnnotation(entryAnnotations.length + 1, entryUid)]);
  };

  const updateAnnotation = (annotationUid: string, newProps: Partial<Annotation>) => {
    console.log('updateAnnotation', annotationUid, newProps);
    setAnnotations(prevAnnotations =>
      prevAnnotations.map(annotation =>
        annotation.uid === annotationUid
          ? { ...annotation, ...newProps }
          : annotation
      )
    );
  };

  const deleteAnnotation = (annotationUid: string) => setAnnotations(annotations.filter(annotation => annotation.uid !== annotationUid));

  const clearAnnotations = () => setAnnotations([]);

  return {
    annotations,
    setAnnotations,
    addAnnotation,
    updateAnnotation,
    deleteAnnotation,
    clearAnnotations,
  }
}

type Annotation = {
  number: number,
  student_entry_uid: string,
  account_id: number,
  account_number: string,
  debit: string,
  credit: string,
  uid: string,
}

export default useAnnotation
