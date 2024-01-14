import React, { useState } from 'react';

/**
 * Stateful logic for storing and changing text from both
 * <input type=text> and <textarea> elements.
 */
const useFormInputText = () => {
  const [value, setValue] = useState<string>('');

  const handleChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.currentTarget.value);
  }

  return {
    value,
    setValue,
    handleChange
  }
}

export default useFormInputText;
