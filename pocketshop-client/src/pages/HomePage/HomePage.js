import React, { useState, useEffect, useContext } from "react";
import {useDispatch, useSelector} from "react-redux";
import { withRouter } from "react-router-dom";
import { AuthContext } from "./../../context/authcontext";

import axios from "./../../axiosinstance";
import queryString from "query-string";
import { makeStyles } from "@material-ui/core/styles";

import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";

import { blue } from "@material-ui/core/colors";

import ProductsContainer from "../../containers/ProductsContainer/ProductsContainer";
import { LogoSearchToolsContainer } from "../../containers/LogoSearchToolsContainer/LogoSearchToolsContainer";

import { SearchBar } from "../../components/SearchBar/SearchBar";
import { CategoryDropdown } from "../../components/CategoryDropdown/CategoryDropdown";

import {mainBtnColor} from "./../../global-styles/styles";
import {getStripeToken, updateVendor} from "./../../strore/actions/vendor"

import "./styles.css";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    height: "3ch",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  btn: {
    backgroundColor: `${mainBtnColor}`,
  },
  icon: {
    color: "white",
  },
  total: {
    marginLeft: ".5rem",
    color: "white",
  },
}));

const HomePage = (props) => {
  const classes = useStyles();
  const [category, setCategory] = useState("all");
  const dispatch = useDispatch();
  const [cartItems, setCartItems] = useState([]);
  const [stripeSuccess, setStripeSuccess] = useState(false);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };
  const userfirebase_id = useSelector(state => state.user.firebase_id)
  const firebase_id = localStorage.getItem("firebase_id")

  const loggedIn = useSelector(state => state.vendor.loggedIn)
  const user_type = useSelector(state => state.user.user_type)
  const stripeId= useSelector(state => state.vendor.stripe_id)
  let params = queryString.parse(props.location.search)
  let stripe_id = params.code

  // console.log(stripeSuccess)
  // console.log('params with code:', firebase_id)
  console.log(" firebase_id", firebase_id)
  console.log(" firebase_id", userfirebase_id)

  const getStripeToken = () => {
    // let params = queryString.parse(props.location.search)
    let stripeToken = params.code
    console.log('params with code:', params.code)
      axios.post(`/stripe/token`, {stripe_id: stripe_id, firebase_id: firebase_id })
      .then(res => {
        console.log("Stipe Onboarding Completed! top", stripe_id)
        console.log("Stipe respoonse top!", res.data)

        if (res.status === 200) {
          //TODO: CLEAN UP THE ERROR HANDLING ON FRONT AND BACK END
          console.log("Stipe Onboarding Completed!", stripe_id)
          console.log("Stipe respoonse!", res.data, firebase_id)
          dispatch(updateVendor(firebase_id, {stripe_id: res.data}))
          // setStripeSuccess(true)
          //TODO: REMOVE PUT REQUEST AND HANDLE UPDATING THE VENDOR'S STRIPE INFO ON FRONTEND
          // axios.put(`/vendor/${firebase_id}`, {stripe_id: res.data.stripe_user_id})
          // .then(res => {
          //   if (res.status === 200) {
          //     console.log("The vendor's stripe id has been added!", {stripe_id: stripe_id})
          //     console.log("The vendor's stripe id has been added! params", stripe_id)

          //   }
          // })
          // .catch (err => {
          //   console.log("The vendor's stripe id was not added:", err)
          //   //TODO: IF STRIPE VENDOR ON BOARDING FAILS SET STRIPE_FALE TO TRUE
          //   // IF TRUE A POPUP SHOULD SHOW UP ASKING THE VENDOR TO SIGN IN AGAIN
          //   //ONCE CLICKED THE INIT STRIPE FUNCTION SHOULD BE LAUNCHED
          // })
        } else {
          // setStripeSuccess(false)
          console.log("fail");
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  useEffect (() => {
    if (user_type === "vendor" && !stripeId) {
      console.log("init stripe")
      console.log("init stripe, ", userfirebase_id)

      getStripeToken()
    }
      return () => {
        console.log("unsubscribe ")
      }
  }, )

  return (
    <div className="home-page">
      <LogoSearchToolsContainer
        category={category}
        handleCategoryChange={handleCategoryChange}
      ></LogoSearchToolsContainer>
      <ProductsContainer
        cartItems={cartItems}
        setCartItems={setCartItems}
      ></ProductsContainer>
    </div>
  );
};

export default withRouter(HomePage);
