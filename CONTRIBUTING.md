# Contributing to Breads Server

We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

-   Reporting a bug
-   Discussing the current state of the code
-   Submitting a fix
-   Proposing new features
-   Becoming a maintainer

## Before you contribute

Our aim is to **keep it simple** for the developers to contribute to this project. See the folder structure (with concise description)

## How to contribute

1. First, fork (make a copy) of this repo to your Github account.

2. Clone (download) your fork to your computer

3. Keep your clone in sync with the original repo (get the latest updates)

    HTTPS
    ```
    git remote add upstream https://github.com/zero-to-mastery/breads-server.git
    git pull upstream master
    ```

    SSH
    ```
    git remote add upstream git@github.com:zero-to-mastery/breads-server.git
    git pull upstream master
    ```
    ([For more info](https://www.freecodecamp.org/news/how-to-sync-your-fork-with-the-original-git-repository/))   

4. Download and install the latest version of [MySQL](https://dev.mysql.com/downloads/mysql/)
    **on macOS, run the following command to be able to use the `mysql` cli tool  
    `export PATH=${PATH}:/usr/local/mysql/bin/`  

5. Create your local database

    `Mysql -u root -p` and enter password you set during installation  
    `CREATE DATABASE breads`

6. Create database tables and import seed data

    - Run `mysql -u <YOUR USERNAME> -p <YOUR DATABASE NAME> < mysql/tables.sql` to create tables
    - Run `mysql -u <YOUR USERNAME> -p <YOUR DATABASE NAME> < mysql/import.sql` to import seed data

7. Install Node.js and Python packages

    - Run `npm install`
    - Run `python3 -m pip install cython`
    - Run `python3 -m pip install -r requirements.txt`

8. Set up your local environment variables

    Create a `.env` file in the root directory:

    - `LOCAL_CORS` - frontend url (i.e. 'http://localhost:3000')

    **To make requests from tools like Postman, set `LOCAL_CORS=localhost:8080` (8080 is the default port)

    **MySQL**

    - `LOCAL_HOST` - local MySQL hostname
    - `LOCAL_USER` - local MySQL username
    - `LOCAL_DBPASSWORD` - local MySQL password
    - `LOCAL_DB` - local MySQL database name

    **JWT** - create a secret key for JWT based authentication

    - `SECRET_KEY` - JWT secret key

    **[Cloudinary](https://cloudinary.com/)** - Used for image hosting. Set up a free account to get a cloud name, API key, and API Secret _(only needed if working on user CRUD)_

    - `CLOUDINARY_CLOUD_NAME` - Cloud Name
    - `CLOUDINARY_API_KEY` - API Key
    - `CLOUDINARY_API_SECRET` - API Secret

    **[Link Preview](https://www.linkpreview.net/)** - Used as a fallback for the webscraper. Set up a free account to get an API key _(only needed if working on webscraper)_

    - `LINK_PREVIEW_KEY` - API Key

    **Nodemailer** - Used to send password reset emails. Add an email login information _(only needed if working on reset password feature)_

    - `EMAIL_LOGIN` - email address
    - `EMAIL_PASSWORD` - email password
    - `EMAIL_URL` - frontend url (i.e 'http://localhost:3000')
    
    **Chrome Webdriver** - Used as a fallback to get reading data when the initial scrape fails. [Instructions to download here.](https://splinter.readthedocs.io/en/latest/drivers/chrome.html) _(only needed if working on webscraper)_

    - `CHROMEDRIVER_DIR` - Place in the directory of the script and then copy the relative path and paste it here. If it's in a different directory, you'll need the complete path.
    
    At the end `.env` file will look like this:

        ```
        LOCAL_CORS=<FRONTEND URL>
        LOCAL_HOST=localhost
        LOCAL_USER=<YOUR MYSQL USERNAME>
        LOCAL_DBPASSWORD=<YOUR MYSQL PASSWORD>
        LOCAL_DB=<YOUR DB NAME>
        CLOUDINARY_CLOUD_NAME=<YOUR CLOUDINARY CLOUD NAME>
        CLOUDINARY_API_KEY=<YOUR CLOUDINARY API KEY>
        CLOUDINARY_API_SECRET=<YOUR CLOUDINARY API SECRET>
        SECRET_KEY=<YOUR SECRET STRING>
        LINK_PREVIEW_KEY=<YOUR CLOUDINARY CLOUD NAME>
        CHROMEDRIVER_DIR=<PATH TO WEBDRIVER>
        ```
9. Run `npm start` and confirm the server is running 

10. Create a new branch `git checkout -b <your_branch_name>`.

11. Start making your changes.

12. Pull from the upstream again before you commit your changes, like you did in step 3. This is to ensure your still have the latest code.

If you see an error similar to `Your local changes to the following files would be overwritten by merge. Please commit your changes or stash them before you merge` on using `git pull upstream master` use:

    ```
    git stash
    git pull upstream master
    git stash pop
    ```

([For more info](https://bluecast.tech/blog/git-stash/))

13. Commit and push the code to your fork

14. In your repo GitHub page, create a pull request to the `development` branch. This will allow us to see changes in a staging environment before merging to `master`. If everything runs correctly, your pull request will be merged into `master`.

([For more info](https://www.atlassian.com/git/tutorials/comparing-workflows/forking-workflow))

## This project uses the Creative Commons Attribution 4.0 International License

When you submit code changes, your submissions are understood to be under the same CC License that covers the project. Feel free to contact the maintainers if that's a concern.

## Report bugs using Github's [issues](../../issues)

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](../../issues); it's that easy!

## Write bug reports with detail, background, and sample code

**Great Bug Reports** tend to have:

-   A quick summary and/or background
-   Steps to reproduce
    -   Be specific!
    -   Give sample code if you can.
-   What you expected would happen
-   What actually happens
-   Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

People _love_ thorough bug reports. I'm not even kidding.

## Use a Consistent Coding Style

Observe the coding style of the project and add your code also in the same style.
**Don't make major changes** (Like changing the complete folder structure)
