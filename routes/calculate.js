const express = require("express");
const router = express.Router();

// Function to calculate the next order date
const getNextOrderDate = (currentOrderDate, daysToHold) => {
  const orderDate = new Date(currentOrderDate);
  const newOrderDate = new Date(orderDate);
  newOrderDate.setDate(orderDate.getDate() + daysToHold);
  return { orderDate, newOrderDate };
};

// Function to calculate the total after discount
const calculateTotal = (orderAmount, discountAmount) => {
  return orderAmount - (discountAmount / 100) * orderAmount;
};

// GET route to render the calculation form
router.get("/calculate", (req, res) => {
  // Ensure user is authenticated before showing the form
  if (!req.isAuthenticated()) {
    return res.redirect("/"); // Redirect to home if not authenticated
  }

  res.render("calculate", { errors: [] }); // Render a form for input data with an empty error array
});

// POST route to handle calculation logic
router.post("/calculate", (req, res) => {
  const { current_order_date, days_to_hold, order_amount, discount_amount } =
    req.body;

  let orderDate, newOrderDate, total;
  let errors = [];

  // Validation
  if (!current_order_date && !order_amount) {
    errors.push(
      "At least one of the fields (Current Order Date or Order Amount) is required."
    );
  }

  // Calculate the next order date if both required fields are provided
  if (current_order_date && days_to_hold) {
    ({ orderDate, newOrderDate } = getNextOrderDate(
      current_order_date,
      parseInt(days_to_hold)
    ));
  }

  // Calculate the total after discount if both required fields are provided
  if (order_amount && discount_amount) {
    total = calculateTotal(
      parseFloat(order_amount),
      parseFloat(discount_amount)
    );
  }

  // If there are validation errors, render the form again with errors
  if (errors.length > 0) {
    return res.render("calculate", { errors });
  }

  // Render the result view with conditional results
  res.render("result", {
    start_date: orderDate ? orderDate.toLocaleDateString() : null,
    next_order_date: newOrderDate ? newOrderDate.toLocaleDateString() : null,
    days_to_hold: days_to_hold || null,
    total: total ? total.toFixed(2) : null,
    order_amount: order_amount || null,
    discount_amount: discount_amount || null,
  });
});

module.exports = router;
