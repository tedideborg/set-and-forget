<script>
    import { tweened } from 'svelte/motion';

    import './reset.css';
    import './style.css';

    const SHOW_SCORE = 'showScore';
    const SHOW_START_SCREEN = 'showStartScreen';
    const SHOW_NUMBER_GUESS = 'showNumberGuess';
    const SHOW_GUESS_INPUT = 'showGuessInput';
    const showDuration = 3000;

    let currentView = SHOW_START_SCREEN;
    let randomizedPassword = 0;
    let amountOfDigits = '';
    let score = 0;
    let randomGuessNumber = 0;
    let playerGuessNumber = '';
    let won = false;
    let showInfo = false;

    const progressValue = tweened(0, {
        duration: showDuration,
    });

    const generateNumber = () => {
        const length = parseInt(amountOfDigits);
        const min = parseInt('1' + '0'.repeat(length - 1));
        const max = parseInt('9'.repeat(length));
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    const checkWin = () => {
        won = parseInt(playerGuessNumber) === randomGuessNumber;
        if (won) score++;
        playerGuessNumber = '';
        progressValue.set(0, { duration: 0 });
        changeView(SHOW_SCORE);
    };

    const countdown = (start) => {
        if (start) {
            setTimeout(() => {
                changeView(SHOW_GUESS_INPUT);
            }, showDuration);
            progressValue.set(1);
        }
    };

    const changeView = (view) => {
        currentView = view;
    };

    const viewChanged = (view) => {
        switch (view) {
            case SHOW_NUMBER_GUESS:
                countdown(true);
                randomGuessNumber = generateNumber();
        }
    };

    $: {
        viewChanged(currentView);
    }
</script>

<main class="container">
    <section>
        {#if currentView === SHOW_START_SCREEN}
            <!-- Header/ title -->
            <hgroup>
                <h1>Set and forget</h1>
                <h2>Set a number password and forget it</h2>
            </hgroup>
            <!-- Password generator -->
            <input
                type="text"
                id="number"
                name="number"
                placeholder="Set the length of the password"
                required
                bind:value={amountOfDigits}
            />
            <button
                type="submit"
                on:click={() => (randomizedPassword = generateNumber())}
            >
                Generate
            </button>

            {#if randomizedPassword !== 0}
                <!-- Generated password -->
                <div
                    class="modal-background"
                    on:click={() => (randomizedPassword = 0)}
                />
                <div class="modal">
                    {#if amountOfDigits}
                        <h1>{randomizedPassword}</h1>
                        <p>
                            Copy it, write it down or save it somehow (the site
                            isn't saving it so you wont be able to retrieve it
                            later)
                        </p>
                        <button
                            on:click={() => {
                                changeView(SHOW_NUMBER_GUESS);
                            }}>Start game</button
                        >
                    {:else}
                        <h4>
                            Please set a length of the password, like 4 (for a
                            screen time password)
                        </h4>
                        <button on:click={() => (randomizedPassword = 0)}
                            >Back</button
                        >
                    {/if}
                </div>
            {/if}
        {:else}
            <!-- Memory -->
            {#if currentView === SHOW_NUMBER_GUESS}
                <h1>{randomGuessNumber}</h1>
                <progress value={$progressValue} />
            {:else if currentView === SHOW_SCORE}
                <h1 class={won ? 'won' : 'lost'}>
                    {won ? 'Correct!' : 'Wrong!'}
                </h1>
                <h3>score</h3>
                <h1>{score}</h1>
                <button
                    on:click={() => {
                        changeView(SHOW_NUMBER_GUESS);
                    }}>Next</button
                >
            {:else if currentView === SHOW_GUESS_INPUT}
                <input
                    type="text"
                    id="playerGuessNumber"
                    name="playerGuessNumber"
                    placeholder="write your guess..."
                    required
                    bind:value={playerGuessNumber}
                />
                <button on:click={checkWin}>Submit</button>
            {/if}
        {/if}
        <button class="infoIcon" on:click={() => (showInfo = true)}>i</button>
        {#if showInfo}
            <div class="modal-background" on:click={() => (showInfo = false)} />
            <div class="modal">
                <h3>What</h3>
                <p>
                    A simple webbsite built with Svelte that is for generating a
                    numbered password and then making you forget it.
                </p>
                <h3>How</h3>
                <p>
                    By generating a password that you set and then write down or
                    store somehow (in case you ever need to unlock it). After
                    that you get to play a number memory game that aims to make
                    you forget the password you just wrote down. Try to get as
                    high of a score as possible :)
                </p>
                <h3>Why</h3>
                <p>
                    I was having trouble always bypassing the screen time on my
                    phone so I figured maybe I could generate a new password
                    each day. Problem was that I would remember the number each
                    time and just type it in. With this site I hope I can make
                    myself (and others) reduce the time spent on my phone by
                    making it more of a hassle to unlock the screen time code.
                </p>
                <h3>Me</h3>
                <div class="links">
                    <a href="https://twitter.com/TedIdeborg">Twitter</a>
                    <a href="https://tedideborg.github.io">Website</a>
                </div>
                <button on:click={() => (showInfo = false)}>Close</button>
            </div>
        {/if}
    </section>
</main>
