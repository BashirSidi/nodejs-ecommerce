# nodejs-ecommerce

This is an application that will allow users to view items and shop add them to cart a and eventually attempt to purchase them, so when a user comes to the site I am going to show them a list of different items that they can purchase for each item, and I will show an image, title and the price and they will eventually underneath each each item will have a button that say add to cart, so if user click that they are going to add that item to a shopping cart then eventually when a user decided to checkout they can click on the cart which will link up and go to a page where they will see their shopping cart with all the different items that they have added. 

So for each item I will show a title a quantity a price and total price for that line item, and the user should also have the ability to remove this item out of  the shopping cart as well from the screen and at the bottom will show the total for all the items in the cart and have a buy button right underneath it, but the button is not actually do anything, so in practice if a user clicked on buy button he would start to accept some credit card payment or something.

But I am not going to do the billing or anything like that inside this project, because I am going to focus more on how to use JavaScript to build a web server and show some dynamic pages, and I will make it in such a way that someone who own the site or runs it on a day to day basis would also have the ability to add new items, and edit or delete the existing ones as well, so in addition to this I am going to be making a series of hidden pages that I am going to refer as an admin panel.

The admin panel is going to give an administrator or someone who owns or runs the web site the ability to create products, take a look to all the existing ones edit the existing ones to change their image, title or price, and can delete them as well. If a user decides to create a product or edit an existing one I will show form that will have a text input for the product name, the price and then a button to upload an image as well.

And I will probably want to make sure that not everybody come to the site apart from the administrator or site owner through authentication. And there will be a signup page for administrator where I will take email, password and password confirmation, if user or admin log out, I need to make they also have the ability to sign back in the future as well, and only administrators are required to log into the web site, a end user or like customer can browse all the different items and have a shopping cart without logging in at all, so I only have two types of users, normal users and an administrator. 

And I will make it in such a way an administrators can see the administration pages as well as where they can manage the list of all the different product.

# how to run:

- Go into the root directory of the application and run " npm install "
- then, run " npm run dev " and open localhost 3000 on your browser tap.
