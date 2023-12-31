// React
import React, { useState } from "react";
import { Form } from "react-bootstrap";

// FontAwseome
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Components
import "./SearchBar.scss";

interface SearchBarProps {
  focusHighlight?: boolean;
  style?: React.CSSProperties;
  className?: string;
  onSubmit?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = (props) => {
	const [isInputFocused, setIsInputFocused] = useState(false);
	const [searchQuery, setSearchQuery] = useState<string>();

	const setHighlighting = (value: boolean) => {
		if (props.focusHighlight) {
			setIsInputFocused(value);
		}
	};

	const classNames = "search-bar" + (props.className ? ` ${props.className}` : "");

	const submit = () => {
		if (props.onSubmit) {
			if (searchQuery) {
				props.onSubmit(searchQuery);
			}
		}
	};

	return (
		<div
			className={classNames}
			style={isInputFocused ? focusStyle : {}}>
			<Form className="search-input-container" onSubmit={submit}>
				<Form.Group controlId='search'>
					<Form.Control
						type='text'
						placeholder='Enter search here'
						className='search-input'
						onFocus={() => setHighlighting(true)}
						onBlur={() => setHighlighting(false)}
						onChange={(e) => setSearchQuery(e.target.value) }
					/>
				</Form.Group>
			</Form>
			<FontAwesomeIcon
				icon={ faSearch }
				size="xl"
				className="search-icon"
				onClick={submit}/>
		</div>
	);
};

SearchBar.defaultProps = {
	focusHighlight: true
};

const focusStyle = {
	borderStyle: "solid",
	borderColor: "blue",
	boxShadow: "0 0 10px rgba(1.0, 0.0, 0.0, 1)"
};

export default SearchBar;
