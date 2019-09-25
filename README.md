# Aurexia's Wallet Dev environment

This project is aiming the creation of an internal Blockchain, allowing Aurexia Staff to exchange Tokens.

## Author and Copyright

© Copyright Aurexia – All rights reserved

## Project Status

This project is currently a demo version. The real version will be available at https://aurexiagit.github.io/index.html

## How to modify the codes

GitHub is the best way to develop your programs. Indeed, it allows several users to access the same code, 
modify it on their computer and commit it back on the GitHub. All the different commits are available
which allows you to go back to a previous version whenever it suits you.

In order to interact with the GitHub server and change the files, you can simply change them on this page. 
However, the best practice is to download the files onto your computer and modify the files directly onto your computer.
Once you are done modifying the files, do as follows:

1. Open command window into the project's folder
2. Enter "git add ."
3. Enter "git commit -m "TITLE OF YOUR COMMIT"
4. Enter "git push"

If the codes were modified by some other user implying that the files on your computer do not correspond with the files
on the GitHub, before modifying anything you must:

1. Open command window into the project's folder
2. Enter "git pull"

For more explanation go to https://guides.github.com/

## Description of the project

There are two versions of the project:
* Metamask Version: the oldest and most stable one currently. It uses Metamask to interact with the Ethereum Blockchain
on the Ropsten testnet
* Fortmatic Version: the most recent version, not yet stable. It uses Fortmatic to interact with the Ethereum Blockchain
on the Rinkeby testnet

The index.html file allows the user to choose which version he wants to use.

Inside each Folder, you will find all the basic website components:

### HTML files

* index.html: the home page where you can simply send tokens to other members
* events.html: the events page where you can access several events
  * eventError.html: the error page shown to users when the event they selected isn't available
  * blockchainGame.html: the page of the first blockchain game that was presented to the partners the 23/01/2019
  * donation.html: the page where users can select a charity and give all their tokens
* admin.html: the admin page only used by the owner of the smart contract. You can access several admin pages:
  * adminCharities.html: a page showing the donations made to "La Cravate Solidaire" and "Les Bouchons d'Amour"
  * adminList.html: a page giving the list of users and their AST balance
  * adminMember.html: a page allowing the administrator to add or remove users to the blockchain
  * adminSend.html: a page allowing the administrator to send tokens on behalf of any other user
  * adminToken.html: a page allowing the administrator to create (mint) or destroy (burn) tokens
  * adminTransactions.html: a page showing the history of all transactions occurring on the blockchain

### Other folders

#### Images

It contains every single image used inside the website.

#### Scripts

It contains every single JavaScript file called by the html files.
* main.js: main js file used by all the html files to initiate the connection to the Blockchain and other layouts.
* links.js: a js file used by all the html files containing the links between html files
* users.js: a js file listing all users and their characteristics into a dictionary
* htmlFile.js: a js file for each html file giving all the necessary interactions

#### Styles

It contains every single CSS file creating the html layouts
* style.css: a general file giving shared layouts
* header.css: a file giving the header's layout
* form.css: a file giving the layout of the forms of the website
* graph.css: a file giving the layout of the graphs of the website
* htmlFile.css: a file for each html file giving all the necessary layouts

#### SmartContracts

It contains the smart contract solidity code and its corresponding ABI code. They are not used by the website, they are just stored here
for information and in case they need to be changed.


    
  

