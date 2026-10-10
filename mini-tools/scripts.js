const config = (function() {
    const oldTestVocabulary = [
        'the',
        'cat',
        'lazy',
        'brown',
        'gray',
        'quick',
        'run',
        'sleep',
        'around',
        'us',
        'and',
        'we',
        'love',
        'them'
    ];
    const testVocabulary = [
        'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
        'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
        'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
        'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
        'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
        'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
        'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
        'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
        'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
        'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
        'cat', 'dog', 'run', 'walk', 'jump', 'sleep', 'eat', 'drink', 'read', 'write',
        'fast', 'slow', 'quick', 'lazy', 'brown', 'gray', 'red', 'blue', 'green', 'happy',
        'sad', 'big', 'small', 'tall', 'short', 'hot', 'cold', 'bright', 'dark', 'loud',
        'quiet', 'soft', 'hard', 'clean', 'dirty', 'new', 'old', 'young', 'rich', 'poor',
        'easy', 'difficult', 'safe', 'dangerous', 'strong', 'weak', 'smart', 'kind', 'brave', 'calm',
        'around', 'under', 'over', 'through', 'between', 'before', 'after', 'inside', 'outside', 'beside',
        'always', 'never', 'often', 'sometimes', 'usually', 'rarely', 'today', 'tomorrow', 'yesterday', 'soon',
        'here', 'there', 'everywhere', 'nowhere', 'somewhere', 'away', 'forward', 'backward', 'upward', 'downward',
        'apple', 'banana', 'house', 'car', 'tree', 'water', 'fire', 'wind', 'earth', 'sun',
        'moon', 'star', 'sky', 'ocean', 'river', 'mountain', 'stone', 'flower', 'grass', 'bird',
        'fish', 'horse', 'cow', 'sheep', 'wolf', 'bear', 'lion', 'tiger', 'monkey', 'snake',
        'book', 'pen', 'paper', 'desk', 'chair', 'door', 'window', 'phone', 'computer', 'clock'
    ];

    const vocabulary = [];
    let wordCount = 0;
    let word = testVocabulary[0];
    const savedWords = [];

    window.getTestVocabulary = function() {
        return testVocabulary;
    }

    window.getWordDetails = function() {
        return {
            wordCount: wordCount,
            word: word
        };
    }

    window.updateWordDetails = function() {
        wordCount++;
        word = testVocabulary[wordCount];
        return;
    }

    window.getVocabulary = function() {
        return vocabulary;
    }

    window.saveWordInfo = function(word, tags) {
        const wordRecord = savedWords.filter((data) => data.word === word);
        if (wordRecord.length === 1) {
            for (let i = 0; i < tags.length; i++) {
                if (!wordRecord[0].tags.includes(tags[i])) {
                    wordRecord[0].tags.push(tags[i]);
                }
            }
        } else {
            savedWords.push({word: word, tags: tags});
        }
    }

    window.getSavedWords = function() {
        return savedWords;
    }
})();

function generateNounTest(word) {
    const tests = [
        {test: `The <strong>${word}</strong> is nice.`, tags: ['noun', 'standard-singular-noun']},
        {test: `The <strong>${word}s</strong> are nice.`, tags: ['noun', 's-plural-noun']},
        {test: `The <strong>${word}es</strong> are nice.`, tags: ['noun', 'es-plural-noun']},
        {test: `The <strong>${word.substring(0, word.length - 1)}ies</strong> are nice.`, tags: ['noun', 'ies-plural-noun']},
        {test: `A pair of <strong>${word}</strong> are on the counter.`, tags: ['noun', 'plural-singular-noun']},
        {test: `None of these`, tags: ['not-noun']}
    ];
    return tests;
}

function generateVerbTest(word) {
    const tests = [
        {test: `The cat will <strong>${word}</strong>.`, tags: ['verb']},
        {test: `The cat <strong>${word}s</strong>.`, tags: ['verb', 's-present-tense-verb']},
        {test: `The cat is <strong>${word}ing</strong>.`, tags: ['verb', 'present-participle-verb']},
        {test: `The cat is <strong>${word + word.substring(word.length - 1, word.length)}ing</strong>.`, tags: ['verb', 'double-letter-present-participle-verb']},
        {test: `None of these`, tags: ['not-verb']}
    ];
    return tests;
}

function generateAdjectiveTest(word) {
    const tests = [
        {test: `The cat is quite <strong>${word}</strong>.`, tags: ['adjective']},
        {test: `None of these`, tags: ['not-adjective']}
    ];
    return tests;
}

function generateAdverbTest(word) {
    const tests = [
        {test: `The cat ran <strong>${word}</strong>.`, tags: ['adverb']},
        {test: `The cat ran <strong>${word}ly</strong>.`, tags: ['adverb', "ly-adverb"]},
        {test: `The cat ran <strong>${word.substring(0, word.length - 1)}ily</strong>.`, tags: ['adverb', 'ily-adverb']},
        {test: `None of these`, tags: ['not-adverb']}
    ];
    return tests;
}

function generateDeterminerTest(word) {
    const tests = [
        {test: `I want to pet <strong>${word}</strong> cat.`, tags: ['determiner']},
        {test: `I want to eat <strong>${word}</strong> apple.`, tags: ['determiner', 'vowel-determiner']},
        {test: `I want to pet <strong>${word}</strong> cats.`, tags: ['determiner', 'plural-determiner']},
        {test: `None of these`, tags: ['not-determiner']}
    ];
    return tests;
}

function bindAnswerClick(element) {
    $(element).on('click', function(index) {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            if ($(this).text() === 'None of these') {
                $('.answer').each(function(index) {
                    $(this).removeClass('selected');
                });
            } else {
                $('.answer').each(function(index) {
                    if ($(this).text() === 'None of these') {
                        $(this).removeClass('selected');
                    }
                });
            }
            $(this).addClass('selected');
        }
    })
}

function buildTest(tests, word) {
    $('#test').empty().attr('word', word).attr('questions', Object.keys(tests).length);
    $('#test').append(`<h1>Word: <span class="word">${word}</span></h1>`);
    let iteration = 1;
    for (let test in tests) {
        $('#test').append(`<div class="question" test="${test}" question="${iteration}" style="display: none"></div>`);
        const question = $(`.question[test="${test}"]`);
        question.append(`<h2>${test} test`);

        for (let i = 0; i < tests[test].length; i++) {
            const answer = $(`<div class="answer" tags="${tests[test][i].tags.join(' ')}"><p>${tests[test][i].test}</p></div>`);
            question.append(answer);
        }

        question.append(`<div class="next button" question="${iteration}"><p>Next</p></div>`);
        iteration++;
    }

    $('.question').each(function(index) {
       if (index === 0) {
           $(this).fadeIn();
       }
    });

    $('.answer').each(function(index) {
        bindAnswerClick($(this));
    });

    $('.next').on('click', function(index) {
        saveAnswers(word);
        if ($(this).attr('question') === $('#test').attr('questions')) {
            newWord();
        } else {
            $(this).parents('.question').fadeOut(200, function () {
                $(`.question[question="${parseInt($(this).attr('question')) + 1}"]`).fadeIn();
            });
        }
    });
}

function saveAnswers(word) {
    const tagsList = [];
    $('.answer').each(function(index) {
        if ($(this).hasClass('selected')) {
            const tagsString = $(this).attr('tags').split(' ');
            for (let i = 0; i <tagsString.length; i++) {
                if (!tagsList.includes(tagsString[i])) {
                    tagsList.push(tagsString[i]);
                }
            }
        }

    });

    saveWordInfo(word, tagsList);
}

function newWord() {
    updateWordDetails();
    setupTest();
}

function setupTest() {
    const wordDetails = getWordDetails();

    const tests = {
        verb: generateVerbTest(wordDetails.word),
        noun: generateNounTest(wordDetails.word),
        adjective: generateAdjectiveTest(wordDetails.word),
        determiner: generateDeterminerTest(wordDetails.word),
        adverb: generateAdverbTest(wordDetails.word)
    }

    buildTest(tests, wordDetails.word);
}

$(document).ready(() => {
   const testVocabulary = getTestVocabulary();
   setupTest();

   $('#export').on('click', function() {
      const savedWords = getSavedWords();
      console.log(savedWords);
      $('p#json').text(JSON.stringify(savedWords));
   });
});