# test parce

# Start

`npm install --save-dev parcel`

`npm i`

`npm start`

`git status`

`git add .` `git commit -m "text commit"` `git push`

## Open branch

ctrl+shift+p --> Create Branch --> Enter --> 'name branch' VS Code --> Publish
Branch

## Close branhc

In GitHub: Compare & pull reguest --> "...comment" --> Create pull request -->
Merge pull request --> Confirm merge In VS Code: git checkout main -->
ctrl+shift+G g -> open "Source Control" --> Sync Changes.

### _*new accaunt*_

```
git config --global user.name "ТвоёИмяНаGitHub"
git config --global user.email "твой_email_на_GitHub@example.com"
```

### **_проверка_**

```
git config user.name
git config user.email
```

### delete cache /dist & /.parcel-cache
` rm -rf dist .parcel-cache `
` npm run build `


### _Take from GitHub after creating a new repository_
```
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/ТВОЙ_АККАУНТ/ИМЯ_РЕПОЗИТОРИЯ.git
git push -u origin main 
```


### _deplou project_
` npm run deploy `