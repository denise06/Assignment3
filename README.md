# Minime! 

## PROJECT  3 :   Full Stack Web Development Project

Minime is an ecommerce store where interested buyers can purchase quality toys/apparels for your little ones at a discounted price. Interested parents can even trade in their products by following the step by step guide on our website.
This idea stems from the amount of waste generated by parents where used toys of good conditions are either thrown away or passed down to people who doesn't really need them. With the use of Minime, we are able to ensure that baby/toddler's toys will not go to waste, and also cultivate a sharing culture among the young parents. 



## FEATURES 
The website plans to have the following features.

_Basic_
- A welcome homepage to give a brief introduction of Minime and the trade in option
- A detailed trade in page to share more on the steps to take for parents to trade in their toys/apparels 
- An overview page of all the listing as well as quick search functions for buyers to filter the items
- An item detail page to view more information about the listing
- Registered buyers are able to login and add items to their cart as well as checkout using Stripe payment
- Admin person using the role of a "seller" is able to create, update and delete a listing, but they are unable to purchase/checkout.
- Sellers are able to view all the orders placed by buyers and is able to update the status of an order once fulfilled or even delete an order
- A superadmin account using the role of "superaccount" is able to have all the buttons, including checkout, create, update, delete of an item as well as shop management functionalities like updating order status or deleting of orders.
- The all orders page also have basic search functionalities which allows sellers to quickly search for orders based on the unique Order ID, User ID, and maximum total amount. The page shows basic order details like the product id and it's respective quantity 



_Intermediate (coming soon...)_
- Allow buyers to see their past purchases
- Buyers are able to recieve email updates automatically triggered by order status changes


_Advance (current version will not have any development for this level)_
- Allow users to input shipping information
- Vue shopping cart

## UI/UX

The landing page gives users a quick overview of what Minime is and what are the services available, be it trading in, or purchasing safe products for their lvoed ones. 
The colour tone for the website is more of a neutral, greyish/baby blue scheme, to potray a cool and comforting environment. Call to action buttons changes colour once cursor mouse over them. 

**Non Registered users**
The use of cards with images when viewing all the orders gives users a quick overview of all the listings on minime. 
Description on the cards are kept to the minimal and users are able to see more product details by clicking on the "View Details" button. 
Non registered users who chanced upon the website is able to see the product listings and view the details, however, they are unable to see the "Add to cart" button to make any purchases. 

**Registered Buyers**
Quick add to cart buttons are only available on the overview page for users that have logged in and registered with us as buyers. The "Add to cart" button is also available to buyers in the view details page to ensure a smooth buyer experience. 
Buyers no longer have to worry that the toys/apparels are unsafe for their kids as Minime will do the offline verification of all the products before listing them. Items are also tagged with the safety guarentees and brands to gain the trust of the parents 
The use of Stripe checkout allows a seamless and cashless experience with the intiutive user interface. 
Once payment is made, a successful payment page is displayed to confirm buyer's order

**Registered Sellers**
Minime is also user friendly for sellers, who are mainly the Minime employees helping to list products after they have verified the product safety features. 
Sellers are able to create/update/delete item listings which includes features like image upload. The form interface is simple and straight forward with ony the crucial fields validation. 
Sellers are unable to make purchases, hence will not be able to see the add to cart button. 
All orders page is also available to display crucial information to sellers to aid with the fulfilment of the orders. 
Quick search functionality is also made available so sellers and search a particular order quickly based on the Order ID
They are able to update the order status. Orders are only generated after payment is successfully done by buyers. 

**Superadmin**
They have the features of both a buyer and a seller. 



## Demo

A live demo can be found here 
Git Pod

![Overview of Project in different devices](public/Minime Demo.png)



## Technologies
1. Javascript
2. SQL
3. Express
4. Bootstrap
5. 

## Testing
Manual Testing is done to ensure that the all functions are functional.

**Test accounts:**
Buyer account: minimebuyer@g.com, PW: minime123!
Seller account: minimeseller@g.com, PW: minime123!
Super account: minimesuper@g.com, PW: minime123!

*No* | *Steps* | *Expected Results* | *Observations*
--- | --- | --- | ---
1 | `When webiste is loaded ` | `Minime homepage is shown with a carousell displaying the items in Minime and trade in details at the bottom ` | **Pass** 
2 | `Click on 'Trade in Now!' button` | `Redirected to Tradie in page with instructions on how to list products with us` | **Pass** 
3 | `Click on About Us on nav bar` | `Able to see the about page with Registration link and Trade in link` will display at the top of the home page | **Pass** 
4 | `At About page, click on Register with us link` | `Redirected to Register page with Username, Email, Role, Password and Confirm Password fields in the form` | **Pass** 
5 | `Fill in details and click submit` | `User account registered and redirected to login page` | **Pass** 
6 | `Enter email and password and click submit button` | `User login and user profile is displayed with username, email and role` | **Pass** 
7 | `Click sign out button on top right` | `Goodbye and redirected to login page` | **Pass** 
8 | `Login with super account: email: minimesuper, password: minime123!` | `User login and able to see All Listings, Create and All Orders on the navigation panel` | **Pass** 
9 | `Click on All Listings on navigation bar` | `Able to view quick search and all listings in card forms displaying all buttons (Update, Delete, Add to Cart, View Details` | **Pass** 
10 | `Test out the buttons Update, delete and view details` | `Able to update product details including images used. View details page will show the age group, condition, price and an "Add to Cart" button` | **Pass** 
11 | `Test the Add to cart button on both Product details page and All listings page ` | `User is redirected to "My Shopping Cart" page ` | **Pass** 
12 | `Change the quantity and click update quantity. Add another item and click remove to add and remove from cart ` | `Quantity of item is updated and item is removed when remove button is clicked` | **Pass** 
13 | `Click checkout button, fill in 42424242424242 as the testing card account and the expiry date of > current date, CVC 121, click pay ` | `Redirected to stripe checkout page with the total amount displayed on the left with all the order items and respective prices. After entereing details, user is able to make payment and redirected to successful page` | **Pass** 
14 | `Click on All orders tab to view all the orders placed by different users` | `Able to see a quick search panel on orderid, maximum order amount, userid. A table showing all the orders with order SN, order ID, order total, user id, order details, order status, and 2 actions, update status and delete order` | **Pass** 
15 | `Enter filter criteria, update status from paid to completed, delete order` | `Order table is filtered accurately based on filter criteria. User able to update status with old status default filled in in the order status update page. Able to delete order` | **Pass** 
16 | `log out of super account and login as a buyer role ` | `User is only able to see "Home, About Us, My Cart All Listings and under All listings page, only able to Add to Cart and view details ` | **Pass** 
17 | `log out of buyer account and login as seller role ` | `User is able to see "Home, About Us, All Listings, Create, All Orders in the nav bar. There should not be My cart in nav bar. In All listings, only able to creation, update, delete, not able to add to cart` | **Pass** 
11 | `Repeat above steps in PC/Mobile view` | `UI is optimised for both PC and mobile for all pages, functionalities are retained for both` | **Pass** 

## Deployment

Backend API is deployed using Heroku while front end APP is deployed using netlify 
The deployed site will update automatically update the database. 

Heroku link: https://dcyx-tgc-assignment2.herokuapp.com/item_record![image](https://user-images.githubusercontent.com/43426431/134777033-01c46a98-f980-42f6-9db5-be6e87f58d71.png)
Vue App Link: https://csb-q9s1o.netlify.app/


## Credits

Code institues instructor Paul Chor for development guidance
Teaching assistant Shaun for helping with troubleshooting of bugs
Ecommerce websites such as Shopee as website inspiration
 
Designs, layout and functions are original




Acknowledgements
1. Use of Font Awesome full icons
2. Ecommerce listing image files are taken from Google images & flaticons
3. Code base is adapted from Paul Chor's coding lessons and tutorial



