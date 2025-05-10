import axios from "axios";
import logo from "../../Images/logo.png";
import { error, success } from "../../Utils/notification";
import { sendOrderRequest } from "./sendOrderRequest";

export const initPayment = (
  busdata,
  creds,
  orderDetails,
  date,
  ticket,
  busid,
  userid,
  amount,
  token,
  dispatch,
  navigate
) => {
  const { name, age, gender, mobile, email } = creds;

  const options = {
    key: "rzp_test_fCRGTJzks5Z0Ly",
    order_id: orderDetails.id,
    amount: orderDetails.amount,
    currency: orderDetails.currency,
    image: logo,
      name: "Smart Sky",
    description: "Thanks For Booking, Happy Journey!",

    prefill: {
      name: `${name}`,
      email: email,
      contact: mobile,
      age: age,
      gender: gender,
    },

    handler: async function (response) {
      try {
        const { data } = await axios.post(
          "https://ed66-2603-8000-57f0-9250-849e-941-d5df-88bd.ngrok-free.app/api/payment/verify",
          response
        );

        success(data.message);

        sendOrderRequest(
          busdata,
          creds,
          orderDetails.id,
          response,   
          date,
          ticket,
          busid,
          userid,
          amount,
          token,
          dispatch,
          navigate
        );
        
      } catch (error) {
        console.log(error);
        return { status: false };
      }
    },

    theme: { color: "#5266FA" },
  };

  const rzp = new window.Razorpay(options);

  //If payment failed
  rzp.on("payment.failed", (response) => {
    console.log(response.error);
    error("Payment failed, please try again");
    return { status: false };
  });

  //Open razorpay window
  rzp.open();
};
