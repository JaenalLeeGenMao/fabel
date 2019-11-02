import React, { Component } from "react";
import { Select, Checkbox } from "semantic-ui-react";

import ProductCard from "./product-card";

import "./App.scss";
import "semantic-ui-css/semantic.min.css";

class App extends Component {
    state = {
        isLoading: true,
        products: [],
        filteredProducts: [],
        furnitureStyles: [],
        deliveryTime: []
    };

    filterOptions = {};

    componentDidMount() {
        const productsUrl = "http://www.mocky.io/v2/5c9105cb330000112b649af8";
        fetch(productsUrl)
            .then(res => res.json())
            .then(data => {
                const deliveryTime = this.getDeliveryTime(data.products);

                this.setState({
                    isLoading: false,
                    products: data.products || [],
                    filteredProducts: data.products || [],
                    furnitureStyles: data.furniture_styles || [],
                    deliveryTime
                });
            })
            .catch(e => console.log(`ERROR: ${e}`));
    }

    getDeliveryTime = products => {
        const deliveryTime = [],
            visited = [];
        if (products) {
            products.forEach(({ delivery_time }) => {
                if (visited.indexOf(delivery_time) === -1) {
                    visited.push(delivery_time);
                    deliveryTime.push({
                        key: `dt_${delivery_time}`,
                        value: delivery_time,
                        text: `${delivery_time} week`
                    });
                }
            });
        }

        deliveryTime.sort((a, b) => a.value - b.value);
        return deliveryTime;
    };

    handleFilter = ({ name, value }) => {
        const { products } = this.state;

        /** setting up filterOptions */
        switch (name) {
            case "keyword":
                this.filterOptions[name] = value;
                break;
            case "deliveryTime":
                this.filterOptions[name] = value;
                break;
            default:
                if (!this.filterOptions[name]) {
                    this.filterOptions[name] = "true";
                } else {
                    delete this.filterOptions[name];
                }
                break;
        }

        /** filter products based on filterOptions */
        let filteredProducts = products;
        Object.keys(this.filterOptions).forEach(key => {
            const filterValue = this.filterOptions[key];
            switch (key) {
                case "keyword":
                    filteredProducts = filteredProducts.filter(p =>
                        p.name.toLowerCase().includes(filterValue.toLowerCase())
                    );
                    break;
                case "deliveryTime":
                    filteredProducts = filteredProducts.filter(
                        p =>
                            parseInt(p.delivery_time, 10) <=
                            parseInt(filterValue, 10)
                    );
                    break;
                default:
                    filteredProducts = filteredProducts.filter(p => {
                        return p.furniture_style.includes(key);
                    });
                    break;
            }
        });

        this.setState({
            filteredProducts
        });
    };

    getFilterOptionsFS() {
        const result = [];
        Object.keys(this.filterOptions).forEach(key => {
            if (key !== "keyword" && key !== "deliveryTime") {
                result.push(key);
            }
        });

        return result.join(", ");
    }

    render() {
        const {
            isLoading,
            filteredProducts,
            furnitureStyles,
            deliveryTime
        } = this.state;

        return (
            <div className="App">
                <FilterSection
                    deliveryTime={deliveryTime}
                    furnitureStyles={furnitureStyles}
                    onChange={this.handleFilter}
                    fsValue={this.getFilterOptionsFS()}
                />
                {filteredProducts.length > 0 || isLoading ? (
                    filteredProducts.map((product, fpIndex) => (
                        <ProductCard key={fpIndex} {...product} />
                    ))
                ) : (
                    <h3 className="empty__result">Oops, Nothing matches </h3>
                )}
            </div>
        );
    }
}

const FilterSection = ({
    deliveryTime,
    furnitureStyles,
    onChange,
    fsValue
}) => (
    <div className="filter_section">
        <input
            className="f__furniture_name"
            placeholder="Search Furniture"
            onChange={e =>
                onChange({
                    name: "keyword",
                    value: e.target.value
                })
            }
        />
        <form className="f__furniture_style_form">
            <input
                className="f__furniture_style"
                placeholder="Furniture Style"
                value={fsValue}
                readOnly
            />
            <ul>
                {furnitureStyles.map(fsName => (
                    <li key={fsName}>
                        <label htmlFor={fsName}>{fsName}</label>
                        <Checkbox
                            id={fsName}
                            onChange={() =>
                                onChange({
                                    name: fsName,
                                    value: null
                                })
                            }
                        />
                    </li>
                ))}
            </ul>
        </form>
        <Select
            className="f__furniture_dt"
            placeholder="Delivery Time"
            options={deliveryTime}
            onChange={e => {
                onChange({
                    name: "deliveryTime",
                    value: e.currentTarget
                        .querySelector("span")
                        .innerText.replace(/\s|week$/g, "")
                });
            }}
        />
    </div>
);

export default App;
