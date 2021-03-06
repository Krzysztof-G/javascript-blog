'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
};


const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorsSelector = '.post-author',
  optTagsListSelector = '.tag.list',
  optCloudClassCount = 5,
  optCloudClassPrefix = 'tag-size-',
  optAuthorsListSelector = '.list.authors';

const titleClickHandler = function (event) {
  const clickedElement = this;
  event.preventDefault();
  console.log('Link was clicked!', event);

  /* remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');

  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }
  /* add class 'active' to the clicked link */
  console.log('clickedElement:', clickedElement);
  clickedElement.classList.add('active');
  /* remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts .post.active');

  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }
  /* get 'href' attribute from the clicked link */
  const href = clickedElement.getAttribute('href');
  console.log('href is', href);
  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(href);
  console.log('targetArticle is', targetArticle);
  /* add class 'active' to the correct article */
  targetArticle.classList.add('active');
};


function generateTitleLinks(customSelector = '') {

  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';
  /* for each article */

  const articles = document.querySelectorAll(optArticleSelector + customSelector);

  let html = '';

  for (let article of articles) {

    /* get the article id */
    const articleId = article.getAttribute('id');
    console.log('id is', articleId);

    /* find the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    console.log('article title is', articleTitle);
    /* get the title from the title element */
    const title = article.getAttribute('title');
    console.log('title is', title);

    /* create HTML of the link */
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
    console.log('html link:', linkHTML);

    /* insert link into titleList */
    titleList.insertAdjacentHTML('beforeend', linkHTML);
    html = html + linkHTML;
  }
  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');

  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }

}
generateTitleLinks();

function calculateTagsParams(tags){
  const params = {max:0, min:99999};
  for(let tag in tags){
    console.log(tag + ' is used ' + tags[tag] + ' times');
    params.max = Math.max(tags[tag], params.max);
    params.min = Math.min(tags[tag], params.min);
  }

  return params;
}

function calculateTagClass(count, params){
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);

  return optCloudClassPrefix + classNumber;
}

function generateTags(){
  /* [NEW] create a new variable allTags with an empty array */
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  /* START LOOP: for every article: */
  for (let article of articles){
  /* find tags wrapper */
    const tagWrapper = article.querySelector(optArticleTagsSelector);
    tagWrapper.innerHTML = '';

    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    console.log('data-tags are:', articleTags);
    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    console.log(articleTagsArray);
    /* START LOOP: for each tag */
    for(let tag of articleTagsArray){
      console.log(tag);

      /* generate HTML of the link */
      //const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
      const linkHTMLData = {id: tag};
      const linkHTML = templates.tagLink(linkHTMLData);
      console.log('html link:', linkHTML);

      /* add generated code to html variable */
      html = html + linkHTML;

      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags[tag]) {

        /* [NEW] add generated code to allTags array */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }

    /* END LOOP: for each tag */
    }

    /* insert HTML of all the links into the tags wrapper */

    /* END LOOP: for every article: */
    tagWrapper.innerHTML = html;

    /* [NEW] find list of tags in right column */

    const tagList = document.querySelector('.tags');

    /* [NEW] create variable for all links HTML code */
    const tagsParams = calculateTagsParams(allTags);
    console.log('tagsParams:', tagsParams);
    const allTagsData = { tags: [] };

    /* [NEW] START LOOP: for each tag in allTags: */
    for(let tag in allTags){
    /* [NEW] generate code of a link and add it to allTagsHTML */
      allTagsData.tags.push({
        tag: tag,
        count: allTags[tag],
        className: calculateTagClass(allTags[tag], tagsParams),
      });
    }
    /* [NEW] END LOOP: for each tag in allTags: */

    /*[NEW] add HTML from allTagsHTML to tagList */
    tagList.innerHTML = templates.tagCloudLink(allTagsData);
    console.log('allTagsData: ', allTagsData);
  }
}

generateTags();


function tagClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();
  console.log('Link was clicked!', event);
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  console.log('href is', href);
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  /* find all tag links with class active */
  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');
  /* START LOOP: for each active tag link */
  for (let tagLink of tagLinks){
    /* remove class active */
    tagLink.classList.remove('active');
  /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const equalLinks = document.querySelectorAll('a[href="' + href + '"]');
  console.log(equalLinks);
  /* START LOOP: for each found tag link */
  for (let equalLink of equalLinks){
    /* add class active */
    equalLink.classList.add('active');
  /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag +'"]');
}

function addClickListenersToTags(){
  /* find all links to tags */
  const tagLinks = document.querySelectorAll('[href^="#tag-"]');
  /* START LOOP: for each link */
  for (let tagLink of tagLinks){
    /* add tagClickHandler as event listener for that link */
    tagLink.addEventListener('click', tagClickHandler);
  /* END LOOP: for each link */
  }
}

addClickListenersToTags();

function generateAuthors(){
  /* [NEW] create a new variable allAuthors with an empty array */
  let allAuthors = {};
  console.log('allAuthors:', allAuthors);
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  /* START LOOP: for every article: */
  for (let article of articles){
  /* find author wrapper */
    const authorWrapper = article.querySelector(optArticleAuthorsSelector);
    authorWrapper.innerHTML = '';

    /* make html variable with empty string */
    let html = '';
    /* get author from data-tags attribute */
    const articleAuthor = article.getAttribute('data-author');
    console.log('data-author are:', articleAuthor);

    /* generate HTML of the link */
    //const linkHTML = '<li><a href="#author-' + articleAuthor + '">' + articleAuthor + '</a></li>';
    const linkHTMLData = {id: articleAuthor};
    const linkHTML = templates.authorLink(linkHTMLData);
    console.log('html link:', linkHTML);

    /* add generated code to html variable */
    html = html + linkHTML;
    /* [NEW] check if this link is NOT already in allTags */
    if(!allAuthors[articleAuthor]) {

      /* [NEW] add generated code to allTags array */
      allAuthors[articleAuthor] = 1;
    } else {
      allAuthors[articleAuthor]++;
    }
    authorWrapper.innerHTML = html;

    const authorList = document.querySelectorAll(optAuthorsListSelector);

    let allAuthorsHTML = '';

    for (let author in allAuthors) {
      allAuthorsHTML += '<li><a href="#author-' + author + '"><span>' + author + '</span>' + ' (' + allAuthors[author] + ')' +'</a></li>';
    }
    for (let author of authorList) {
      author.innerHTML = allAuthorsHTML;
    }

  }
}
generateAuthors();

function authorClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();
  console.log('Link was clicked!', event);
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  console.log('href is', href);
  /* make a new constant "author" and extract tag from the "href" constant */
  const author = href.replace('#author-', '');
  console.log(author);
  /* find all author links with class active */
  const authorLinks = document.querySelectorAll('a.active[href^="#author-"]');
  /* START LOOP: for each active author link */
  for (let activeAuthorLink of authorLinks){
    /* remove class active */
    activeAuthorLink.classList.remove('active');
  /* END LOOP: for each active author link */
  }
  /* find all author links with "href" attribute equal to the "href" constant */
  const equalLinks = document.querySelectorAll('a[href="' + href + '"]');
  console.log(equalLinks);
  /* START LOOP: for each found author link */
  for (let equalLink of equalLinks){
    /* add class active */
    equalLink.classList.add('active');
  /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthor(){
  /* find all links to tags */
  const authorLinks = document.querySelectorAll('[href^="#author-"]');
  /* START LOOP: for each link */
  for (let authorLink of authorLinks){
    /* add tagClickHandler as event listener for that link */
    authorLink.addEventListener('click', authorClickHandler);
  /* END LOOP: for each link */
  }
}

addClickListenersToAuthor();
