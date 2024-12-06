import React, { useState } from 'react';
import useDebounce from './useDebounce';
import styles from './SearchInput.module.css';
const SearchInput = ({ value, onChange }) => {
    const [displayValue, setDisplayValue] = useState(value);
    const debouncedChange = useDebounce(onChange, 600);

    function handleChange(event) {
        setDisplayValue(event.target.value);
        debouncedChange(event.target.value);
    }

    return (
        <input
            className={styles.input_topo}
            type="text"
            value={displayValue}
            onChange={handleChange}
            placeholder="Pesquisar"
        />
    );
};

export default SearchInput;
