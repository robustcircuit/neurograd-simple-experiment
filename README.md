# Online Experiment Workshop 2024 - CRNL

This preparatory process should take you under 10 minutes. It is necessary because internet connections in our institutes are sometimes inexistent, commonly bad and occasionally down.

See you on June 18th!

## Mandatory steps

### Install NodeJS

To run a web experiment, we need a simple web server. One of the simplest options is to use Nodejs to develop this server with JavaScript. It is available on all platforms.

Download it here:  [https://nodejs.org/en](https://nodejs.org/en)

### Install a code editor if you don't have any

One of the best code editors at the moment is VScode. It is available on all platforms and it has an amazing set of core functionalities and extensions.

You can download here: [https://code.visualstudio.com/](https://code.visualstudio.com/)

If you have already a preferred editor and that you know how to use it, no need to change your habits for this workshop.

### Clone or download this folder

Clone the following repository somewhere on your computer.

##### Method 1: Download

Go to https://github.com/robustcircuit/now-workshop

Directly download and unzip the folder on your computer (green button Code > Download Zip)


##### Method 2: Using Git

Download and install [Git Bash](https://git-scm.com/)

Decide the location of the folder by using the command cd (E.g. cd Documents) and copy the following git command

```
git clone [https://github.com/robustcircuit/now-workshop](https://github.com/robustcircuit/WebExp-CRNL)
```

##### Method 3: Using Visual Studio Code (and git!)

Go to [https://code.visualstudio.com/](https://code.visualstudio.com/) 

Open a new terminal (Ctrl+Shift+ç) and copy the git command described above


### Install the dependencies

If it is not done already, open a terminal and navigate to the 'server' subfolder of the repository you've just cloned/unzip.
```
cd C:\Documents\WebExp-CRNL\server
```
Note: To find the path of your folder, check its location under its properties.

Since you have already installed NodeJS, you can readily run npm commands in the terminal. Just type:
```
npm install
```
It will download a couple of *node-modules* in the server subdirectory. Note that npm is by default purely **local**. It means that running this command does not modify in any way your system and that uninstall is as simple as deleting the folder from your computer 😊.

That's it! 

We have simply downloaded a couple of Javascript modules that will allow us to run a web server and program our web experiment during the practical session, even if we don't have access to internet!

## Optional steps

### Have a look at the program

In principle, you should already be able to run the webserver and see the experiment running by typing in the command line:
```
node app
```
And by visiting the local address `http://localhost:3000/expNOW` from your browser.

If something is not right, it may be a good idea to poke us at <a href="mailto:robustcircuit.lda@gmail.com">robustcircuit.lda@gmail.com<a>

### Read a bit

- About the [difference between HTML, CSS and Javascript](https://www.ironhack.com/us/blog/the-differences-between-html-css-and-javascript) when it comes to web design (3 minutes)
- About [synchronous programming](https://dev.to/luizcalaca/sync-and-async-for-dummies-or-cooking-chefs-5759) (3 minutes)

If you are motivated, you can even start having a look at the [jsPsych](https://www.jspsych.org/7.3/) documentation 😉


### Install ngrok
[Ngrok](https://ngrok.com/download) is a simple app that can help you serve your web experiment from any computer. It is very useful to pretest and pilot your experiments before hosting them on a real server or in the cloud.




