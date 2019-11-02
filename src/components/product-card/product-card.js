import React, { Component } from "react";
import ReactTooltip from "react-tooltip";

import "./product-card.css";

class ProductCard extends Component {
    render() {
        const {
            name = "",
            description = "",
            furniture_style = "",
            delivery_time = "",
            price = ""
        } = this.props;
        return (
            <div className="pc__container">
                <div className="pc__header">
                    <title className="pc__name">{name}</title>
                    <strong className="pc__price">
                        {price ? `Rp ${price.toLocaleString()}` : ""}
                    </strong>
                </div>
                <p className="pc__desc">{description}</p>
                <p className="pc__furniture_styles">
                    {furniture_style.join(", ")}
                </p>
                <div className="pc__footer">
                    <p className="pc__delivery_days" data-tip="Delivery Days">
                        {delivery_time}
                    </p>
                    <ReactTooltip type="info" effect="solid" />
                </div>
            </div>
        );
    }
}

export default ProductCard;
