import React from "react";

const Payment = () => {
  const upiId = "maneeshchandran28@okicici"; // Your UPI ID
  const amount = 100; // Default amount

  const handlePayment = () => {
    const upiUrl = `upi://pay?pa=${upiId}&pn=Donation&am=${amount}&cu=INR`;

    // Check if the user is on a mobile device
    if (navigator.userAgent.match(/Android|iPhone|iPad|iPod/i)) {
      window.location.href = upiUrl; // Redirect to UPI app
    } else {
      alert(
        "UPI payment links can only be opened on mobile devices with UPI apps installed."
      );
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Donate to Support Us</h1>
      <p style={styles.description}>
        Your contribution helps us grow and provide better services.
      </p>
      <button onClick={handlePayment} style={styles.button}>
        Donate ₹{amount}
      </button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "2em",
    marginBottom: "10px",
  },
  description: {
    fontSize: "1em",
    color: "#666",
    marginBottom: "20px",
  },
  button: {
    backgroundColor: "#3d6f1b",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "10px 20px",
    fontSize: "1em",
    cursor: "pointer",
  },
};

export default Payment;
