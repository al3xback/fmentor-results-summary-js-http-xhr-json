import { sendHttpRequest } from './util.js';

const URL =
	'https://gist.githubusercontent.com/al3xback/51c662fe33362ee03f74daca5baea62a/raw/ecb6fd70e06b016fb752ec02be807569ec095ded/results-summary-data.json';

const cardWrapperEl = document.querySelector('.card-wrapper');
const cardTemplate = document.getElementById('card-template');
const cardResultTemplate = document.getElementById('card-result-template');
const cardCategoryTemplate = document.getElementById('card-data-item-template');
const cardSummaryTemplate = document.getElementById('card-summary-template');
const loadingEl = document.querySelector('.loading');

const removeLoading = () => {
	loadingEl.parentElement.removeChild(loadingEl);
};

const handleError = (msg) => {
	removeLoading();

	const errorEl = document.createElement('p');
	errorEl.className = 'error';
	errorEl.textContent = msg;

	cardWrapperEl.appendChild(errorEl);
};

const renderCardContent = (data) => {
	const { result: resultData, summary: summaryData } = JSON.parse(data);

	const { title: resultTitle, score: resultChart } = resultData;
	const { title: summaryTitle, categories: summaryCategories } = summaryData;

	const cardTemplateNode = document.importNode(cardTemplate.content, true);
	const cardEl = cardTemplateNode.querySelector('.card');

	/* [card result] */
	const cardResultTemplateNode = document.importNode(
		cardResultTemplate.content,
		true
	);
	const cardResultEl = cardResultTemplateNode.querySelector('.card__result');

	const cardResultTitleEl = cardResultEl.querySelector('.card__title');
	cardResultTitleEl.textContent = resultTitle;

	const cardResultChartScoreEl =
		cardResultEl.querySelector('.card__chart-score');
	cardResultChartScoreEl.textContent = resultChart.value.substring(
		0,
		resultChart.value.indexOf(' ')
	);

	const cardResultChartMaxScoreEl = cardResultEl.querySelector(
		'.card__chart-score + span'
	);
	cardResultChartMaxScoreEl.textContent = resultChart.value.substring(
		resultChart.value.indexOf(' ') + 1
	);

	const cardResultDescriptionTitleEl =
		cardResultEl.querySelector('.card__desc-title');
	cardResultDescriptionTitleEl.textContent = resultChart.title;

	const cardResultDescriptionContentEl = cardResultEl.querySelector(
		'.card__desc-content'
	);
	cardResultDescriptionContentEl.textContent = resultChart.description;

	/* [card summary] */
	const cardSummaryTemplateNode = document.importNode(
		cardSummaryTemplate.content,
		true
	);
	const cardSummaryEl =
		cardSummaryTemplateNode.querySelector('.card__summary');

	const cardSummaryTitleEl = cardSummaryEl.querySelector('.card__title');
	cardSummaryTitleEl.textContent = summaryTitle;

	const cardSummaryCategoriesEl =
		cardSummaryEl.querySelector('.card__data-list');

	for (const category of summaryCategories) {
		const { name, score } = category;

		const cardCategoryTemplateNode = document.importNode(
			cardCategoryTemplate.content,
			true
		);
		const cardCategoryEl =
			cardCategoryTemplateNode.querySelector('.card__data-item');
		cardCategoryEl.classList.add('card__data-item--' + name.toLowerCase());

		const cardCategoryImageEl =
			cardCategoryEl.querySelector('.card__data-img');
		cardCategoryImageEl.src =
			'./images/icons/' + name.toLowerCase() + '.svg';
		cardCategoryImageEl.alt = '';

		const cardCategoryTitleEl =
			cardCategoryEl.querySelector('.card__data-title');
		cardCategoryTitleEl.textContent = name;

		const cardCategoryScoreEl = cardCategoryEl.querySelector(
			'.card__data-score span:first-child'
		);
		cardCategoryScoreEl.textContent = score;

		cardSummaryCategoriesEl.appendChild(cardCategoryTemplateNode);
	}

	/* [init] */
	removeLoading();
	cardEl.appendChild(cardResultTemplateNode);
	cardEl.appendChild(cardSummaryTemplateNode);
	cardWrapperEl.appendChild(cardTemplateNode);
};

sendHttpRequest('GET', URL, renderCardContent, handleError);
