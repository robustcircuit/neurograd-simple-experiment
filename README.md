# Neurograd 2025 - Exercise 1

### Clone this repository

Open a terminal in VS Code, use `cd` to navigate where you want and type:
`git clone https://github.com/robustcircuit/neurograd-simple-experiment`


### Install the dependencies

Bavigate to the 'server' subfolder of the repository you've just cloned/unzip.
```
cd %PathToTheRepo%/server
```
Note: To find the path of your folder, check its location under its properties.

Since you have already installed NodeJS, you can readily run npm commands in the terminal. Just type:
```
npm install
```
It will download a couple of *node-modules* in the server subdirectory. Note that npm is by default purely **local**. It means that running this command does not modify in any way your system and that uninstall is as simple as deleting the folder from your computer 😊.

That's it! 

We have simply downloaded a couple of Javascript modules that will allow us to run a web server and program our web experiment during the practical session, even if we don't have access to internet!

### Launch the server

In principle, you should already be able to run the webserver and see the experiment running by typing in the command line:
```
node app
```
And by visiting the local address `http://localhost:3000/expNOW` from your browser.


### Read a bit

- About the [difference between HTML, CSS and Javascript](https://www.ironhack.com/us/blog/the-differences-between-html-css-and-javascript) when it comes to web design (3 minutes)
- About [synchronous programming](https://dev.to/luizcalaca/sync-and-async-for-dummies-or-cooking-chefs-5759) (3 minutes)

If you are motivated, you can even start having a look at the [jsPsych](https://www.jspsych.org/7.3/) documentation 😉





