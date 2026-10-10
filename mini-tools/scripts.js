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
        'book', 'pen', 'paper', 'desk', 'chair', 'door', 'window', 'phone', 'computer', 'clock',
        'abandon', 'ability', 'able', 'abroad', 'absence', 'absolute', 'absorb', 'abstract', 'absurd', 'abundant',
        'academy', 'accent', 'accept', 'access', 'accident', 'accompany', 'accomplish', 'account', 'accuse', 'achieve',
        'acid', 'acquire', 'across', 'act', 'action', 'active', 'actor', 'actress', 'actual', 'adapt',
        'add', 'addition', 'address', 'adequate', 'adjust', 'administer', 'admire', 'admission', 'admit', 'adolescent',
        'adopt', 'adult', 'advance', 'advantage', 'adventure', 'advertise', 'advice', 'advise', 'advocate', 'affair',
        'affect', 'afford', 'afraid', 'agency', 'agenda', 'agent', 'aggressive', 'ago', 'agree', 'agreement',
        'agriculture', 'ahead', 'aid', 'aim', 'air', 'aircraft', 'airline', 'airport', 'aisle', 'alarm',
        'album', 'alcohol', 'alert', 'alien', 'alike', 'alive', 'alley', 'allow', 'alloy', 'almost',
        'alone', 'alphabet', 'already', 'alright', 'also', 'alter', 'alternative', 'altitude', 'altogether', 'aluminum',
        'amateur', 'amazed', 'amazing', 'ambition', 'ambulance', 'amend', 'amount', 'amuse', 'analysis', 'analyze',
        'ancestor', 'ancient', 'anger', 'angle', 'angry', 'animal', 'ankle', 'anniversary', 'announce', 'annual',
        'another', 'answer', 'anticipate', 'anxiety', 'anxious', 'anybody', 'anymore', 'anyone', 'anything', 'anyway',
        'anywhere', 'apart', 'apartment', 'apologize', 'apparent', 'appeal', 'appear', 'appearance', 'appetite', 'applaud',
        'apple', 'applicant', 'application', 'apply', 'appoint', 'appointment', 'appreciate', 'approach', 'appropriate', 'approval',
        'approve', 'approximate', 'architect', 'architecture', 'area', 'argue', 'argument', 'arise', 'arm', 'armed',
        'army', 'arrange', 'arrangement', 'arrest', 'arrival', 'arrive', 'art', 'article', 'artificial', 'artist',
        'artistic', 'ashamed', 'asleep', 'aspect', 'assault', 'assemble', 'assembly', 'assess', 'assessment', 'asset',
        'assign', 'assignment', 'assist', 'assistance', 'assistant', 'associate', 'association', 'assume', 'assumption', 'assure',
        'athlete', 'athletic', 'atmosphere', 'attach', 'attack', 'attempt', 'attend', 'attention', 'attitude', 'attorney',
        'attract', 'attraction', 'attractive', 'audience', 'author', 'authority', 'automatic', 'autumn', 'available', 'average',
        'avoid', 'awake', 'award', 'aware', 'awareness', 'away', 'awful', 'baby', 'bachelor', 'back',
        'bacon', 'bacteria', 'badge', 'badly', 'baggage', 'bake', 'balance', 'balcony', 'ball', 'ballet',
        'balloon', 'bamboo', 'banana', 'band', 'bandage', 'bank', 'banker', 'banner', 'bar', 'bare',
        'barely', 'bargain', 'bark', 'barrel', 'barrier', 'base', 'baseball', 'basement', 'basic', 'basis',
        'basket', 'basketball', 'bass', 'bat', 'bath', 'bathroom', 'battery', 'battle', 'bay', 'beach',
        'beak', 'beam', 'bean', 'bear', 'beard', 'beast', 'beat', 'beauty', 'because', 'become',
        'bed', 'bedroom', 'bee', 'beef', 'beer', 'beg', 'beginner', 'beginning', 'behalf', 'behavior',
        'behind', 'being', 'belief', 'believe', 'bell', 'belong', 'below', 'belt', 'bench', 'bend',
        'beneath', 'benefit', 'berry', 'beside', 'best', 'bet', 'better', 'between', 'beyond', 'bicycle',
        'bid', 'big', 'bike', 'bill', 'billion', 'bin', 'bind', 'biography', 'biological', 'biology',
        'bird', 'birth', 'birthday', 'biscuit', 'bit', 'bite', 'bitter', 'black', 'blade', 'blame',
        'blank', 'blanket', 'blast', 'blend', 'bless', 'blind', 'block', 'blonde', 'blood', 'bloom',
        'blossom', 'blow', 'blue', 'blunt', 'blur', 'blush', 'board', 'boast', 'boat', 'body',
        'boil', 'bold', 'bolt', 'bomb', 'bond', 'bone', 'bonus', 'book', 'boom', 'boost',
        'boot', 'border', 'bored', 'boring', 'borrow', 'boss', 'bother', 'bottle', 'bottom', 'bough',
        'bounce', 'bound', 'boundary', 'bow', 'bowl', 'box', 'boy', 'brace', 'brain', 'brake',
        'branch', 'brand', 'brandy', 'brass', 'brave', 'bread', 'break', 'breakfast', 'breast', 'breath',
        'breathe', 'breed', 'breeze', 'brick', 'bride', 'bridge', 'brief', 'bright', 'brilliant', 'bring',
        'brisk', 'broad', 'broadcast', 'broken', 'bronze', 'broom', 'brother', 'brow', 'brown', 'brush',
        'bubble', 'bucket', 'bud', 'budget', 'buffet', 'bug', 'build', 'building', 'bulb', 'bulk',
        'bullet', 'bunch', 'bundle', 'burden', 'bureau', 'burn', 'burst', 'bury', 'bus', 'bush',
        'business', 'busy', 'butter', 'butterfly', 'button', 'buy', 'buyer', 'buzz', 'cab', 'cabin',
        'cabinet', 'cable', 'cafe', 'cage', 'cake', 'calculate', 'calculation', 'calendar', 'call', 'calm',
        'camera', 'camp', 'campaign', 'campus', 'can', 'canal', 'cancel', 'cancer', 'candidate', 'candle',
        'candy', 'cane', 'cannon', 'canoe', 'canyon', 'cap', 'capable', 'capacity', 'cape', 'capital',
        'captain', 'captive', 'capture', 'car', 'carbon', 'card', 'cardboard', 'care', 'career', 'careful',
        'careless', 'cargo', 'carpet', 'carriage', 'carrier', 'carrot', 'carry', 'cart', 'cartoon', 'case',
        'cash', 'cassette', 'cast', 'castle', 'casual', 'cat', 'catalog', 'catch', 'category', 'cater',
        'cattle', 'caught', 'cause', 'caution', 'cautious', 'cave', 'ceiling', 'celebrate', 'celebration', 'celery',
        'cell', 'cellar', 'cement', 'cemetery', 'census', 'cent', 'center', 'central', 'century', 'cereal',
        'ceremony', 'certain', 'certainly', 'certificate', 'chain', 'chair', 'chairman', 'chalk', 'challenge', 'chamber',
        'champion', 'championship', 'chance', 'change', 'channel', 'chaos', 'chapel', 'chapter', 'character', 'characteristic',
        'charge', 'charity', 'charm', 'chart', 'chase', 'chat', 'cheap', 'cheat', 'check', 'cheek',
        'cheer', 'cheese', 'chef', 'chemical', 'chemist', 'chemistry', 'cherry', 'chess', 'chest', 'chicken',
        'chief', 'child', 'childhood', 'chili', 'chill', 'chimney', 'chin', 'china', 'chip', 'chocolate',
        'choice', 'choir', 'choose', 'chop', 'chord', 'chorus', 'chosen', 'chronic', 'chuckle', 'chunk',
        'church', 'cigar', 'cigarette', 'cinema', 'circle', 'circuit', 'circular', 'circus', 'cite', 'citizen',
        'city', 'civic', 'civil', 'civilian', 'claim', 'clap', 'clarify', 'clarity', 'clash', 'class',
        'classic', 'classical', 'classify', 'classmate', 'classroom', 'clause', 'clay', 'clean', 'clear', 'clearly',
        'clerk', 'clever', 'click', 'client', 'cliff', 'climate', 'climb', 'cling', 'clinic', 'clinical',
        'clip', 'clock', 'clone', 'close', 'closet', 'cloth', 'clothes', 'clothing', 'cloud', 'cloudy',
        'clue', 'clumsy', 'cluster', 'clutch', 'coach', 'coal', 'coarse', 'coast', 'coat', 'cocktail',
        'code', 'coffee', 'coil', 'coin', 'coincide', 'coke', 'cold', 'collapse', 'collar', 'colleague',
        'collect', 'collection', 'collective', 'college', 'colony', 'color', 'colorful', 'column', 'combat', 'combine',
        'come', 'comedy', 'comfort', 'comfortable', 'comic', 'command', 'commander', 'comment', 'commerce', 'commercial',
        'commission', 'commit', 'commitment', 'committee', 'commodity', 'common', 'commonly', 'communicate', 'communication', 'community',
        'company', 'comparable', 'compare', 'comparison', 'compass', 'compete', 'competition', 'competitive', 'competitor', 'compile',
        'complain', 'complaint', 'complement', 'complete', 'completely', 'complex', 'complexity', 'compliant', 'complicate', 'complicated'
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

function generatePronounTest(word) {
    const tests = [
        {test: `<strong>${word}</strong> ran to the store.`, tags: ['pronoun', 'subject-pronoun']},
        {test: `The cat looked at <strong>${word}</strong>.`, tags: ['pronoun', 'object-pronoun']},
        {test: `That is <strong>${word}</strong> book.`, tags: ['pronoun', 'possessive-pronoun']},
        {test: `None of these`, tags: ['not-pronoun']}
    ];
    return tests;
}

function generatePrepositionTest(word) {
    const tests = [
        {test: `The cat jumped <strong>${word}</strong> the box.`, tags: ['preposition']},
        {test: `The book is <strong>${word}</strong> the table.`, tags: ['preposition', 'location-preposition']},
        {test: `None of these`, tags: ['not-preposition']}
    ];
    return tests;
}

function generateConjunctionTest(word) {
    const tests = [
        {test: `The cat wanted to sleep, <strong>${word}</strong> the dog wanted to play.`, tags: ['conjunction', 'coordinating-conjunction']},
        {test: `I will go <strong>${word}</strong> you finish your homework.`, tags: ['conjunction', 'subordinating-conjunction']},
        {test: `None of these`, tags: ['not-conjunction']}
    ];
    return tests;
}

function generateInterjectionTest(word) {
    const tests = [
        {test: `<strong>${word}</strong>! Look at that cat.`, tags: ['interjection']},
        {test: `None of these`, tags: ['not-interjection']}
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
        adverb: generateAdverbTest(wordDetails.word),
        pronoun: generatePronounTest(wordDetails.word),
        preposition: generatePrepositionTest(wordDetails.word),
        conjunction: generateConjunctionTest(wordDetails.word),
        interjection: generateInterjectionTest(wordDetails.word)
    };

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
