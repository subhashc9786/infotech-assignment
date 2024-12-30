
import "./app.css";

import { useEffect } from "react";
import { useState } from "react";


import axios from "axios";
export const App = () => {

  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [orginalData, setOrginalData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [sortOrder, setSortOrder] = useState("lowToHigh");


  useEffect(() => {
    const users = async () => {
      const response = await axios.get("./data.json");
      setOrginalData(response.data)
      setFilterData(response.data);
    }
    users()
  }, [])


  const handleSelectSuggestion = (suggestion) => {

    const newData = orginalData.filter((data) => data.brand == suggestion.brand && data.name == suggestion.name && data.category == suggestion.category)
    setFilterData(newData);
    setSuggestions([])

  };



  useEffect(() => {

    if (searchKeyword.match(/^[a-zA-Z0-9!@. ]+$/g)) {
      let data = [];

      data.push(...orginalData.filter((data) => data?.brand && data?.brand.match(searchKeyword.charAt(0).toUpperCase() + searchKeyword.slice(1))));
      data.push(...orginalData.filter((data) => data?.category && data.category.match(searchKeyword.charAt(0).toUpperCase() + searchKeyword.slice(1))));
      data.push(...orginalData.filter((data) => data?.name && data?.name.match(searchKeyword.charAt(0).toUpperCase() + searchKeyword.slice(1))));

      data = data.filter((value, index, self) =>
        index === self.findIndex((t) => (
          t.id === value.id
        ))
      )
      setSuggestions(data);

    }
  }, [searchKeyword]);


  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };


  useEffect(() => {
    let sortedData = [...filterData];

    if (sortOrder === "lowToHigh") {
      sortedData.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "highToLow") {
      sortedData.sort((a, b) => b.price - a.price);
    }

    setFilterData(sortedData);
  }, [sortOrder]);


  return (

    <div>
      <div className="search-bar-container">
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Search for products, brands, and more"
          className="search-input"
        />
        {suggestions?.length > 0 && searchKeyword.length != 0 && (
          <ul className="suggestions-list">
            {suggestions.map((suggestion, index) => (

              <li
                key={index}
                onClick={() => handleSelectSuggestion(suggestion)}
                className="suggestion-item"
              >
                {`${suggestion.brand} ${suggestion.category} ${suggestion.name}`}
              </li>
            ))}
          </ul>
        )}
      </div>
      <span>Price</span>
      <select value={sortOrder} name="Price" id="" onChange={handleSortChange}>
        <option defaultChecked value="lowToHigh">Low to high</option>
        <option value="highToLow">High to low</option>
      </select>
      <div className="cart-body">
        {filterData?.length ? (
          filterData.map((item) => (
            <div key={item.id} className="cart-item">
              <img src="" alt="" />
              <div className="item-details">
                <p className="item-name">{item.name}</p>
                <p className="item-price">Price₹ :{item.price}</p>
                <p className="item-quantity">Brand: {item.brand}</p>
              </div>
            </div>
          ))
        ) : (
          <p>Your cart is empty!</p>
        )}
      </div>
    </div>

  )
}

// export default App