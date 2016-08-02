// Cookie Cliker HaX

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function dateFormat(date) {
    if (date instanceof Date) {
        var monthNames = [
          "January", "February", "March",
          "April", "May", "June", "July",
          "August", "September", "October",
          "November", "December"
        ];

        var second = addZero(date.getSeconds());
        var minute = addZero(date.getMinutes());
        var hour = addZero(date.getHours());
        var day = addZero(date.getDate());
        var month = addZero(date.getMonth() + 1);
        var year = date.getFullYear();

        return month + '-' + day + '-' + year + ' ' + hour + ':' + minute + ':' + second;
    } else {
        return false;
    }
}

function addZero(num) {
    return (num < 10) ? '0' + num : num;
}

var CookieCheat = {
    tempStorage: [],
    intervals: {},
    timeouts: {},
    autoClicker: {
        running: false,
        start: function() {
            this.running = true;
            var msBetweenClicks = 3;
            var autoClickMultiplier = document.getElementById('auto-clicker-multiplier');
            var autoClickDurationMultiplier = autoClickMultiplier.options[autoClickMultiplier.selectedIndex].value;
            var autoClickDuration = (document.getElementById('auto-clicker-duration').value * autoClickDurationMultiplier);
            var autoClickDurationString = function(multiplier) {
                var time = '';
                switch (multiplier) {
                    case '1':
                        time = ' seconds';
                        break;
                    case '60':
                        time = ' minutes';
                        break;
                    case '3600':
                        time = ' hours';
                        break;
                    case '86400':
                        time = ' days';
                        break;
                    default:
                        time = ' seconds';
                        break;
                }
                return time;
            }
            var clickCounter = Game.cookieClicks;
            var timeleft = autoClickDuration;
            var btn = document.getElementById('auto-clicker-button');
            var btnText = btn.textContent;
            var autoClickerRemainingTime = document.createElement('span');
            autoClickerRemainingTime.id = 'auto-clicker-remaining';
            document.getElementById('auto-clicker').children[0].appendChild(autoClickerRemainingTime);
            autoClickerRemainingTime.textContent = ' (' + timeleft + ' sec)';
            btn.textContent = 'Stop';
            btn.setAttribute('onclick', 'CookieCheat.autoClicker.stop();');
            Game.Notify('Auto clicker cheat','Running autoclicker for ' + (autoClickDuration / autoClickDurationMultiplier) + autoClickDurationString(autoClickDurationMultiplier) + '..', [12, 13], 15);
            var timeLeftInterval = setInterval(function() {
                timeleft--;
                autoClickerRemainingTime.textContent = ' (' + timeleft + ' sec)';
            }, 1000);
            CookieCheat.intervals.timeLeftInterval = timeLeftInterval;
            var clickerInterval = setInterval(function() {
                if (Game.OnAscend > 0 || Game.AscendTimer > 0) {
                    CookieCheat.autoClicker.stop();
                    Game.Notify('Auto clicker cheat', 'Ascending, stopped auto clicker!',  [19, 7], 5);
                }
                Game.ClickCookie();
            }, msBetweenClicks);
            CookieCheat.intervals.clickerInterval = clickerInterval;
            var clickerTimeout = setTimeout(function() {
                clearInterval(CookieCheat.intervals.timeLeftInterval);
                delete CookieCheat.intervals.timeLeftInterval;
                clearInterval(CookieCheat.intervals.clickerInterval);
                delete CookieCheat.intervals.clickerInterval;
                delete CookieCheat.timeouts.clickerTimeout;
                autoClickerRemainingTime.remove();
                btn.textContent = btnText;
                btn.setAttribute('onclick', 'CookieCheat.autoClicker.start();');
                Game.Notify('Auto clicker cheat','Auto clicker finished. Cookie clicked <b>' + (Game.cookieClicks - clickCounter) + '</b> times! Thats <b>' + ((Game.cookieClicks - clickCounter) / autoClickDuration)+ '</b> clicks per second, earning you a total of <b>' + Beautify(Game.computedMouseCps * (Game.cookieClicks - clickCounter)) + '</b> cookies!', [9, 9], 15);
            }, (autoClickDuration * 1000));
            CookieCheat.timeouts.clickerTimeout = clickerTimeout;
        },
        stop: function() {
            this.running = false;
            clearInterval(CookieCheat.intervals.timeLeftInterval);
            delete CookieCheat.intervals.timeLeftInterval;
            clearInterval(CookieCheat.intervals.clickerInterval);
            delete CookieCheat.intervals.clickerInterval;
            clearTimeout(CookieCheat.timeouts.clickerTimeout);
            delete CookieCheat.timeouts.clickerTimeout;
            var btn = document.getElementById('auto-clicker-button');
            btn.setAttribute('onclick', 'CookieCheat.autoClicker.start();');
            btn.textContent = 'Start';
            document.getElementById('auto-clicker-remaining').remove();
            if (Game.OnAscend === 0 || Game.AscendTimer === 0) {
                Game.Notify('Auto clicker cheat', 'Auto clicker stopped manually!', [1, 7], 10);
            }
        }
    },
    cookies: {
        add: function() {
            var amount = parseInt(document.getElementById('add-cookies-amount').value, 10);
            Game.Earn(amount);
        },
        perSecond: {
            calculate: function() {
                var select = document.getElementById('calculate-cookies-multiplier');
                var timeMultiplier = select.options[select.selectedIndex].value;
                var time = document.getElementById('calculate-cookies-time').value;
                var result = Beautify(Game.cookiesPs * timeMultiplier * time);
                Game.Notify('Cookie cheat', Beautify(Game.cookiesPs) + ' * ' + (timeMultiplier * time) + ' = <b>' + result + '</b>!', [0, 7], 10);
            }
        }
    },
    heavenly: {
        add: function() {
            var amount = parseInt(document.getElementById('add-heavenly-amount').value, 10);
            Game.heavenlyChips += amount;
        }
    },
    golden: {
        playChime: true,
        playedChimeOnce: false,
        spawn: function() {
            var select = document.getElementById('golden-choices');
            var selectedEffect = select.options[select.selectedIndex].value;
            var golden = new Game.shimmer('golden');
            golden.force = selectedEffect;
        },
        canSpawn: function() {
            if (Game.shimmerTypes.golden.time === 0) {
                if (Game.chimeType !== 1 && !this.autoClick.running && !this.playedChimeOnce && this.playChime) {
                    PlaySound('snd/chime.mp3');
                    this.playedChimeOnce = true;
                }
                return 1;
            } else if (Game.shimmerTypes.golden.minTime < Game.shimmerTypes.golden.time && Game.shimmerTypes.golden.maxTime > Game.shimmerTypes.golden.time) {
                this.playedChimeOnce = false;
                return 2;
            } else {
                this.playedChimeOnce = false;
                return 0;
            }
        },
        choices: {
            all: Game.goldenCookieChoices.concat(['Cheaper buildings', 'everything must go']),
            list: function() {
                var choices = [];
                for (var i = 0; i < this.all.length; i++) {
                    choices.push({
                        name: this.all[i],
                        id: this.all[++i]
                    });
                }
                return choices;
            },
            current: function() {
                var list = ['click frenzy', 'blab'];

                if (Game.elderWrath > 0) {
                    list.push('clot', 'multiply cookies', 'ruin cookies', 'blood frenzy', 'chain cookie', 'cookie storm', 'cursed finger');
                } else {
                    list.push('frenzy', 'multiply cookies');
                    if (Game.cookiesEarned >= 100000) {
                        list.push('chain cookie', 'cookie storm');
                    }
                    if (Game.hasAura('Reaper of Fields')) {
                        list.push('dragon harvest');
                    }
                    if (Game.hasAura('Dragonflight')) {
                        list.push('dragonflight');
                    }
                }
                if (Game.season == 'fools') {
                    list.push('everything must go');
                }
                if (Game.BuildingsOwned >= 10) {
                    list.push('building special');
                }
                if (Game.shimmerTypes.golden.last != '' && list.indexOf(Game.shimmerTypes.golden.last) != -1) {
                    list.splice(list.indexOf(Game.shimmerTypes.golden.last), 1); // 80% chance to force a different one
                }
                return list;
            },
        },
        autoClick: {
            spawned: function() {
                var response = false;
                if (Game.shimmerTypes.golden.spawned === 1) {
                    response = true;
                }
                if (Game.shimmers.length) {
                    Game.shimmers.forEach(function(el, index) {
                        if (el.type === 'golden') {
                            response = true;
                        }
                    });
                }
                return response;
            },
            running: false,
            toggle: function() {
                if (this.running) {
                    this.stop();
                } else {
                    if (!Game.Has('Golden switch [off]')) {
                        this.start();
                    } else {
                        Game.Notify('Golden auto clicker', 'Golden cookies disabled! Cannot start auto clicker', [1, 7], 10);
                    }
                }
            },
            start: function() {
                this.running = true;
                var btn = document.getElementById('golden-auto-clicker');
                btn.setAttribute('onclick', 'CookieCheat.golden.autoClick.stop();');
                btn.textContent = 'Turn off auto clicker';
                var goldenAutoClick = setInterval(function() {
                    if (Game.OnAscend > 0 || Game.AscendTimer > 0) {
                        CookieCheat.golden.autoClick.stop();
                        Game.Notify('Golden auto clicker', 'Ascending, stopped golden auto clicker!', [19, 7], 5);
                    }
                    if (CookieCheat.golden.autoClick.spawned()) {
                        Game.shimmers.forEach(function(el, index) {
                            if (el.type === 'golden') {
                                el.pop();
                                // Game.shimmerTypes.golden.popFunc(el);
                            }
                        });
                        if (Game.shimmerTypes.golden.last === 'ruin cookies') {
                            var ruinAmount = (Math.min(Game.cookies * 0.05, Game.cookiesPs * 60 * 10) + 13);
                            Game.cookies += Math.min(Game.cookies, ruinAmount);
                            Game.Notify('Golden auto clicker', 'Congratulations! We refunded all of your <b>' + Beautify(ruinAmount) + '</b> cookies', [10, 14], 12);
                        }
                    }
                    if (Game.hasBuff('Clot')) {
                        Game.buffs.Clot.time = 0;
                        Game.Notify('Golden auto clicker', 'Clot be gone! Cookie production restored!', [10, 14], 12);
                    }
                }, 500);
                CookieCheat.intervals.goldenAutoClick = goldenAutoClick;
            },
            stop: function() {
                this.running = false;
                var btn = document.getElementById('golden-auto-clicker');
                btn.setAttribute('onclick', 'CookieCheat.golden.autoClick.start();');
                btn.textContent = 'Turn on auto clicker';
                clearInterval(CookieCheat.intervals.goldenAutoClick);
                delete CookieCheat.intervals.goldenAutoClick;
            }
        },
        html: {
            select: function() {
                var options = '<option value="">Random</option>';
                CookieCheat.golden.choices.list().forEach(function(el, index) {
                    options += '<option value="' + el.id + '">' + el.name + '</option>';
                });
                return options;
            },
            build: function() {
                var select = document.getElementById('golden-choices');
                select.innerHTML = this.select();
            }
        }
    },
    research: {
        finish: {
            all: function() { // Maybe not...
            },
            current: function() {
                Game.researchT = 0;
            }
        }
    },
    achievements: {
        unlock: {
            all: function() {
                CookieCheat.storage.save.achievements('Before unlocked all');
                Game.popups = 0;
                Game.AchievementsById.forEach(function(el) {
                    Game.Win(el.name);
                });
                Game.recalculateGains = 1;
                Game.popups = 1;
                Game.Notify('Achievement cheat','All achievements unlocked!', [9, 9], 10);
            }
        },
        lock: {
            all: function() {
                CookieCheat.storage.save.achievements('Before locked all');
                Game.popups = 0;
                for (element in Game.Achievements) {
                    Game.RemoveAchiev(element);
                }
                Game.recalculateGains = 1;
                Game.popups = 1;
                Game.Notify('Achievement cheat','All achievements locked!', [9, 9], 10);
            },
            cheat: function() {
                Game.RemoveAchiev('Cheated cookies taste awful');
            }
        }
    },
    pledges: {
        reset: function() {
            Game.pledges = 0;
        },
        setTime: function() {
            var select = document.getElementById('pledge-time-multiplier');
            var timeMultiplier = select.options[select.selectedIndex].value;
            var time = document.getElementById('pledge-time').value * timeMultiplier;
            if (time > 0) {
                Game.elderWrath = 0;
                Game.pledgeT = time * Game.fps;
                Game.UpgradesById[74].bought = 1;
                // Game.Unlock('Elder Covenant');
                Game.CollectWrinklers();
                Game.storeToRefresh = 1;
                Game.upgradesToRebuild = 1;
                Game.recalculateGains = 1;
            } else if (time == 0) {
                Game.pledgeT = 0;
                Game.UpgradesById[74].bought = 0;
            }
        }
    },
    storage: {
        save: {
            achievements: function(desc) {
                var store = CookieCheat.tempStorage;
                var tempArr = [];
                var now = Date.now();
                Game.AchievementsById.forEach(function(el, index) {
                    tempArr.push({
                        name: el.name,
                        won: el.won
                    });
                });
                store.push({
                    timestamp: now,
                    description: desc,
                    achievements: tempArr
                });
                CookieCheat.storage.refreshList();
            }
        },
        load: {
            achievement: function() {
                var achievementsToLoad = false;
                var select = document.getElementById('stored-achievements');
                var achievementTimestamp = select.options[select.selectedIndex].value;
                if (achievementTimestamp > 0) {
                    for (var i = 0; i < CookieCheat.tempStorage.length; i++) {
                        if (CookieCheat.tempStorage[i].timestamp == achievementTimestamp) {
                            achievementsToLoad = CookieCheat.tempStorage[i].achievements;
                            break;
                        }
                    }
                    if (achievementsToLoad) {
                        Game.popups = 0;
                        for (achievementIndex in achievementsToLoad) {
                            var achievementObject = achievementsToLoad[achievementIndex];
                            if (achievementObject.won) {
                                Game.Win(achievementObject.name);
                            } else {
                                Game.RemoveAchiev(achievementObject.name);
                            }
                        }
                        Game.recalculateGains = 1;
                        Game.popups = 1;
                        Game.Notify('Achievement cheat','Achievements loaded!', [9, 9], 5);
                    } else {
                        Game.Notify('Achievement cheat','Could not load achievements!', [9, 9], 5);
                    }
                } else {
                    Game.Notify('Achievement cheat','Please select a date to load from!', [9, 9], 5);
                }
                // CookieCheat.storage.refreshList(); // Refresh on load? Nah
            }
        },
        list: function() {
            var timeArr = [];
            if (CookieCheat.tempStorage.length > 0) {
                CookieCheat.tempStorage.forEach(function(el, index) {
                    timeArr.push({
                        timestamp: el.timestamp,
                        formatted: dateFormat(new Date(el.timestamp)),
                        description: el.description
                    });
                });
            }
            return timeArr;
        },
        refreshList: function() {
            var select = document.getElementById('stored-achievements');
            var tempHtml = '';
            this.list().forEach(function(el, index) {
                tempHtml += '<option value="' + el.timestamp + '">' + el.formatted + ' - ' + el.description + '</option>';
            });
            select.innerHTML = tempHtml;
        }
    },
    buffs: {
        stop: {
            all: function() {
                for (i in Game.buffs) {
                    Game.buffs[i].time = 1;
                }
            }
        }
    },
    menu: {
        toggleSize: function() {
            var cheatMenu = document.getElementById('cheatMenu');
            if (cheatMenu.getAttribute('style') === null || cheatMenu.getAttribute('style') === '') {
                cheatMenu.setAttribute('style', 'height: auto;');
            } else {
                cheatMenu.removeAttribute('style');
            }
        }
    },
    seasons: {
        detect: function() {
            var unlocked = 0;
            for (i in Game.seasons) {
                if (Game.seasons[i].triggerUpgrade.unlocked) {
                    unlocked++;
                }
            }
            if (unlocked) {

            }
        },
        resetUses: function() {
            Game.seasonUses = 0;
        },
        end: function() {
            Game.seasonT = 0;
        },
        start: function() {
            var seasons = document.getElementById('season-choices');
            var selectedSeason = seasons.options[seasons.selectedIndex].value;
            if (selectedSeason !== Game.season) {
                this.end();
                var seasonObj = Game.seasons[selectedSeason];
                Game.seasons[selectedSeason].triggerUpgrade.buyFunction();
                Game.seasons[selectedSeason].triggerUpgrade.bought = 1;
                Game.seasonUses -= 1;
                Game.recalculateGains = 1;
            } else {
                this.extend();
            }
            this.popup.timer();
        },
        extend: function() {
            var time = 86400 * Game.fps;
            // var time = document.getElementById('season-extend-time').value;
            Game.seasonT = time;
        },
        popup: {
            spawn: function() {
                Game.seasonPopup.time = Game.seasonPopup.minTime;
                Game.seasonPopup.spawn();
            },
            timer: function() {
                if (Game.season === 'christmas' && document.getElementById('reindeer-timer') === null) {
                    var seasonNode = document.getElementById('edit-season');
                    var reindeerTimers = document.createElement('div');
                    reindeerTimers.id = 'reindeer-timer';
                    reindeerTimers.innerHTML = '<h3 id="reindeer-time-min" class="titleFont">Min:</h3><h3 id="reindeer-time-max" class="titleFont">Max:</h3><h3 id="reindeer-time-current" class="titleFont">Time:</h3>';
                    seasonNode.insertBefore(reindeerTimers, seasonNode.firstChild.nextSibling);
                    var reindeerTimerInterval = setInterval(function() {
                        // document.getElementById('edit-season').firstChild.
                        document.getElementById('reindeer-time-min').textContent = 'Min: ' + Math.ceil(Game.shimmerTypes.reindeer.minTime / Game.fps) + ' seconds';
                        document.getElementById('reindeer-time-max').textContent = 'Max: ' + Math.ceil(Game.shimmerTypes.reindeer.maxTime / Game.fps) + ' seconds';
                        document.getElementById('reindeer-time-current').textContent = 'Time: ' + Math.round(Game.shimmerTypes.reindeer.time / Game.fps) + ' seconds';
                    }, 1000);
                    CookieCheat.intervals.reindeerTimerInterval = reindeerTimerInterval;
                } else if (Game.season !== 'christmas') {
                    var reindeerTimer = document.getElementById('reindeer-timer');
                    if (reindeerTimer !== null) {
                        reindeerTimer.remove();
                        clearInterval(CookieCheat.intervals.reindeerTimerInterval);
                        delete CookieCheat.intervals.reindeerTimerInterval;
                    }
                }
            },
            autoClick: {
                running: false,
                toggle: function() {
                    if (this.running) {
                        this.stop();
                    } else {
                        if (Game.season === 'christmas') {
                            this.start();
                        } else {
                            Game.Notify('Season auto clicker', 'Only works with christmas season!', [1, 7], 10);
                        }
                    }
                },
                start: function() {
                    this.running = true;
                    var btn = document.getElementById('season-auto-clicker');
                    btn.textContent = 'Turn off auto click reindeer';
                    var seasonAutoClickerInterval = setInterval(function() {
                        if (Game.season !== 'christmas') {
                            CookieCheat.seasons.popup.autoClick.stop();
                            Game.Notify('Season auto clicker', 'Stopped auto clicker! Christmas season is no longer active.', [1, 7], 5);
                        }
                        if (Game.shimmerTypes.reindeer.spawned === 1) {
                            Game.shimmers.forEach(function(el, index) {
                                if (el.type === 'reindeer') {
                                    Game.shimmerTypes.reindeer.popFunc(el);
                                }
                            });
                        }
                    }, 1000);
                    CookieCheat.intervals.seasonAutoClickerInterval = seasonAutoClickerInterval;
                },
                stop: function() {
                    this.running = false;
                    var btn = document.getElementById('season-auto-clicker');
                    btn.textContent = 'Turn on auto click reindeer';
                    clearInterval(CookieCheat.intervals.seasonAutoClickerInterval);
                    delete CookieCheat.intervals.seasonAutoClickerInterval;
                }
            }
        },
        drops: {
            egg:  {
                spawn: function() {
                    Game.DropEgg(0);
                }
            },
            has: function(drops, mode) {
                mode = 1;
                var unlocked = 0;
                drops.forEach(function(el, index) {
                    if (mode === 1) {
                        if (Game.Has(el) || Game.HasUnlocked(el)) {
                            unlocked++;
                        }
                    } else if (mode === 2) {
                        if (Game.Has(el) && Game.HasUnlocked(el)) {
                            unlocked++;
                        }
                    }
                });
                return unlocked;
            },
            christmas: function() {
                var drops = ['Christmas tree biscuits', 'Snowflake biscuits', 'Snowman biscuits', 'Holly biscuits', 'Candy cane biscuits', 'Bell biscuits', 'Present biscuits'];
                return {
                    season: 'christmas',
                    drops: {
                        unlocked: this.has(drops),
                        total: drops.length
                    }
                }
            },
            easter: function() {
                var drops = Game.easterEggs;
                return {
                    season: 'easter',
                    drops: {
                        unlocked: this.has(drops),
                        total: drops.length
                    }
                }
            },
            fools: function() {
                var drops = [];
                return {
                    season: 'fools',
                    drops: {
                        unlocked: this.has(drops),
                        total: drops.length
                    }
                }
            },
            halloween: function() {
                var drops = ['Skull cookies', 'Ghost cookies', 'Bat cookies', 'Slime cookies', 'Pumpkin cookies', 'Eyeball cookies', 'Spider cookies'];
                return {
                    season: 'halloween',
                    drops: {
                        unlocked: this.has(drops),
                        total: drops.length
                    }
                }
            },
            valentines: function() {
                var drops = ['Pure heart biscuits', 'Ardent heart biscuits', 'Sour heart biscuits', 'Weeping heart biscuits', 'Golden heart biscuits', 'Eternal heart biscuits'];
                return {
                    season: 'valentines',
                    drops: {
                        unlocked: this.has(drops),
                        total: drops.length
                    }
                }
            },
            status: function() {
                return [this.christmas(), this.easter(), this.fools(), this.halloween(), this.valentines()];
            }
        }
    },
    wrinklers: {
        spawn: function(stop) {
            stop = (typeof stop === 'undefined') ? (Game.getWrinklersMax() - 1) : (stop - 1) ;
            for (i in Game.wrinklers) {
                if (Game.wrinklers[i].phase === 0) {
                    Game.wrinklers[i] = {
                        id: i,
                        close: 0,
                        sucked: 0,
                        phase: 1,
                        x: 0,
                        y: 0,
                        r: 0,
                        hurt: 0,
                        hp: Game.wrinklerHP,
                        type: 0
                    };
                    if (stop !== -1 && i >= stop) {
                        break;
                    }
                }
            }
        }
    },
    autoSave: {
        toggle: function() {
            var autoSaveBtn = document.getElementById('toggle-autosave').children[0];
            if (Game.prefs.autosave) {
                Game.prefs.autosave = 0;
                Game.Notify('Auto clicker cheat', 'Autosave turned <b>off</b>!', [1, 7], 10);
                autoSaveBtn.textContent = 'Turn on autosave';
            } else {
                Game.prefs.autosave = 1;
                Game.Notify('Auto clicker cheat', 'Autosave turned <b>on</b>!', [1, 7], 10);
                autoSaveBtn.textContent = 'Turn off autosave';
            }
            return Game.prefs.autosave;
        }
    },
    ads: {
        hidden: false,
        toggle: function() {
            var ad = document.getElementById('support');
            ad.classList.toggle('hidden');
        }
    },
    init: function() {
        var css = '#cheatMenu:before { content:"Cheats"; } #mouse-cps-value { font-size: 1.25em; font-weight: 600; margin-top: 3px; margin-bottom: 3px; } .cheat-title { padding-top: 8px; padding-bottom: 8px; } #auto-clicker-duration, #pledge-time, #calculate-cookies-time { width: 60px; } .full-w { width: 100%; } .green { color: green; } .red { color: red; } .gold { color: gold; } .hidden { display: none; } .capitalize { text-transform: capitalize; }';
        var head = document.head || document.getElementsByTagName('head')[0];
        var style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) {
        } else {
            style.appendChild(document.createTextNode(css));
        }
        head.appendChild(style);

        var cheatSection = document.createElement('div');
        cheatSection.id = 'cheatMenu';
        cheatSection.className = 'storeSection upgradeBox';
        var line = '<div class="line"></div>';
        var mouseCps = '<div id="mouse-cps"><h3 id="mouse-cps-value" class="titleFont">Mouse CPS: 0</h3></div>';
        var autoClicker = '<div id="auto-clicker"><h3 class="cheat-title titleFont">Auto clicker</h3><input id="auto-clicker-duration" type="number" min="1" value="10"><select id="auto-clicker-multiplier"><option value="1">Seconds</option><option value="60">Minutes</option><option value="3600">Hours</option><option value="86400">Days</option></select><button onclick="CookieCheat.autoClicker.start();" id="auto-clicker-button">Start</button></div>';
        var calculateCookies = '<div id="calculate-cookies"><h3 class="cheat-title titleFont">Calculate cookies</h3><input id="calculate-cookies-time" type="number" min="1" value="10"><select id="calculate-cookies-multiplier"><option value="1">Seconds</option><option value="60">Minutes</option><option value="3600">Hours</option><option value="86400">Days</option></select><button onclick="CookieCheat.cookies.perSecond.calculate();" id="calculate-cookies-button">Calculate</button></div>';
        var cookies = '<div id="add-cookies"><h3 class="cheat-title titleFont">Add cookies</h3><input id="add-cookies-amount" type="number" value="1000000000"><button onclick="CookieCheat.cookies.add();">Add</button></div>';

        var saveAchievements = '<button class="full-w" onclick="CookieCheat.storage.save.achievements(\'Manually\');">Save</button>';
        var storedAchievementsList = '<select id="stored-achievements"><option value="0" disabled selected>Select save</option></select>';
        var achievements = '<div id="cheat-achievements"><div id="unlock-achievements"><h3 class="cheat-title titleFont">Achievements</h3>' + saveAchievements + '<button class="full-w" onclick="CookieCheat.achievements.unlock.all();" id="unlock-achievements-button">Unlock all</button></div><div id="lock-cheat-achievements"><button class="full-w" onclick="CookieCheat.achievements.lock.cheat();" id="lock-achievements-button">Remove cheat</button></div><div id="lock-achievements"><button class="full-w" onclick="CookieCheat.achievements.lock.all();" id="lock-achievements-button">Remove all</button></div><div id="restore-achievements">' + storedAchievementsList + '<button onclick="CookieCheat.storage.load.achievement();" id="restore-achievements-button">Restore save</button></div></div>';

        var research = '<div id="research"><h3 class="cheat-title titleFont">Research</h3><button class="full-w" onclick="CookieCheat.research.finish.current();">Finish current</button></div>';

        var pledgeTime = '<input type="number" id="pledge-time" value="30" min="0"><select id="pledge-time-multiplier"><option value="1">Seconds</option><option value="60" selected>Minutes</option><option value="3600">Hours</option><option value="86400">Days</option></select><button onclick="CookieCheat.pledges.setTime();">Set</button>';
        var elders = '<div id="reset-pledge"><h3 class="cheat-title titleFont">Elder pledge</h3>' + pledgeTime + '<button class="full-w" onclick="CookieCheat.pledges.reset();" id="reset-pledges-button">Reset</button></div>';
        var wrinklers = '<div id="wrinklers"><h3 class="cheat-title titleFont">Wrinklers</h3><button class="full-w" onclick="CookieCheat.wrinklers.spawn(1);">Spawn one</button><button class="full-w" onclick="CookieCheat.wrinklers.spawn();">Spawn all</button><button class="full-w" onclick="Game.CollectWrinklers();">Collect all</button></div>';

        // var goldenSelect = function() {
        //     var options = '<option value="">Random</option>';
        //     CookieCheat.golden.choices.list().forEach(function(el, index) {
        //         options += '<option value="' + el.id + '">' + el.name + '</option>';
        //     });
        //     var select = '<select name="" id="golden-choices">' + options + '</select>';
        //     return select;
        // }
        var goldenCanSpawnInterval = setInterval(function() {
            var goldenClass = '';
            if (CookieCheat.golden.canSpawn() === 1 && !Game.Has('Golden switch [off]')) {
                goldenClass = 'gold';
            } else if (CookieCheat.golden.canSpawn() === 2 && !Game.Has('Golden switch [off]')) {
                goldenClass = 'green';
            } else {
                goldenClass = 'red';
            }
            document.getElementById('golden-cookie-title').textContent = (Game.elderWrath > 0) ? 'Wrath cookie' : 'Golden cookie' ;
            document.getElementById('spawn-golden').children[0].className = 'cheat-title titleFont ' + goldenClass;
            document.getElementById('last-golden').textContent = (Game.shimmerTypes.golden.last === '') ? 'None' : capitalize(Game.shimmerTypes.golden.last);
            document.getElementById('golden-time-min').textContent = 'Min: ' + Math.ceil(Game.shimmerTypes.golden.minTime / Game.fps) + ' seconds';
            document.getElementById('golden-time-max').textContent = 'Max: ' + Math.ceil(Game.shimmerTypes.golden.maxTime / Game.fps) + ' seconds';
            document.getElementById('golden-time-current').textContent = 'Current: ' + Math.round(Game.shimmerTypes.golden.time / Game.fps) + ' seconds';
        }, 1000);
        CookieCheat.intervals.goldenCanSpawnInterval = goldenCanSpawnInterval;
        var lastGolden = '<h3 class="titleFont">Previous effect: <span id="last-golden"></span></h3>';
        var goldenTime = '<h3 id="golden-time-min" class="titleFont">Min:</h3><h3 id="golden-time-max" class="titleFont">Max:</h3><h3 id="golden-time-current" class="titleFont">Time:</h3>';
        var autoClickGolden = '<button class="full-w" id="golden-auto-clicker" onclick="CookieCheat.golden.autoClick.toggle();">Turn on auto clicker</button>';
        var golden = '<div id="spawn-golden"><h3 id="golden-cookie-title" class="cheat-title titleFont" onmouseout="Game.tooltip.shouldHide=1;" onmouseover="Game.tooltip.dynamic=1;Game.tooltip.draw(this, function() { return Game.crate({icon: [23,6], desc: (function() { return \'<p class=&quot;capitalize&quot;><b>\' + CookieCheat.golden.choices.current().join(\'</b></p><p class=&quot;capitalize&quot;><b>\') + \'</b></p>\'; })(), name: \'Currently available effects\', type: \'upgrade\', pool: \'tech\', canBuy: function() { return false; }, getPrice: function() { return 0; } }, \'store\', undefined, undefined, 1)(); }, \'store\');Game.tooltip.wobble();">' + ((Game.elderWrath > 0) ? 'Wrath' : 'Golden') + ' cookie</h3>' + lastGolden + goldenTime + '<select name="" id="golden-choices">' + this.golden.html.select() + '</select><button onclick="CookieCheat.golden.spawn();" id="spawn-golden-button">Spawn</button>' + autoClickGolden + '</div>';
        // var arr = []; CookieCheat.golden.choices.current().forEach(function(element, index) { arr.push(\'<p>\' + element + \'</p>\'); }); return arr.join(\'\'); // Alternative tooltip function
        // function() { return Game.crate({icon: [10, 14], desc: function() { return \'<p>\' + CookieCheat.golden.choices.current().join(\'</p><p>\') + \'</p>\'; }, name: \'Currently available effects\'}, 'store', undefined, undefined, 1)(); }

        var heavenly = '<div id="add-heavenly-chips"><h3 class="cheat-title titleFont">Heavenly chips</h3><input id="add-heavenly-amount" type="number" value="10"><button onclick="CookieCheat.heavenly.add();" id="add-heavenly-button">Add</button></div>';
        var buffs = '<div id="edit-buffs"><h3 class="cheat-title titleFont">Buffs</h3><button class="full-w" onclick="CookieCheat.buffs.stop.all();">Stop</button></div>';

        var seasonSelect = function() {
            var options = '';
            for (obj in Game.seasons) {
                options += '<option value="' + obj + '">' + capitalize(obj) + '</option>';
            }
            var select = '<select id="season-choices">' + options + '</select>';
            return select;
        }

        var season = '<div id="edit-season"><h3 class="cheat-title titleFont" onmouseout="Game.tooltip.shouldHide=1;" onmouseover="Game.tooltip.dynamic=1;Game.tooltip.draw(this, function() { return Game.crate({won: 1, icon: [14,12], desc: (function() { var arr = []; CookieCheat.seasons.drops.status().forEach(function(el) { arr.push(\'<p class=&quot;capitalize&quot; style=&quot;display: inline-block; width: 50%; text-align: left;&quot;>\' + el.season + \'</p><p style=&quot;display: inline-block; width: 50%; text-align: right;&quot;><b>\' + el.drops.unlocked + \'/\' + el.drops.total + \'</b></p>\'); }); return arr.join(\'\'); })(), name: \'Seasonal drops\', type: \'achievement\', tags: [\'Golden tech\'], }, \'store\', undefined, undefined, 1)(); }, \'store\');Game.tooltip.wobble();">Season</h3>' + seasonSelect() + '<button onclick="CookieCheat.seasons.start();">Start</button><button class="full-w" onclick="CookieCheat.seasons.end();">End</button><button id="season-auto-clicker" class="full-w" onclick="CookieCheat.seasons.popup.autoClick.toggle();">Turn on auto click reindeer</button><button class="full-w" onclick="CookieCheat.seasons.resetUses();">Reset uses</button></div>';

        var autoSaveState = (Game.prefs.autosave) ? 'off' : 'on' ;
        var autoSave = '<div id="toggle-autosave"><button class="full-w" onclick="CookieCheat.autoSave.toggle();">Turn ' + autoSaveState + ' autosave</button></div>';

        var toggleAds = '<div id="toggle-ads"><button class="full-w" onclick="CookieCheat.ads.toggle();">Toggle ads</button></div>';
        var toggleFullSize = '<div id="toggle-full-size"><button class="full-w" onclick="CookieCheat.menu.toggleSize();">Keep menu open (toggle)</button></div>';
        var cheatSectionHtml = mouseCps + line + autoClicker + calculateCookies + cookies + heavenly + golden + achievements + research + elders + wrinklers + buffs + season + line + autoSave + toggleAds + toggleFullSize;
        cheatSection.innerHTML = cheatSectionHtml;
        document.getElementById('store').insertBefore(cheatSection, document.getElementById('toggleUpgrades'));

        var updateMouseCpsInterval = setInterval(function() {
            document.getElementById('mouse-cps-value').textContent = 'Mouse CPS: ' + Beautify(Game.computedMouseCps, 1);
        }, 2000);
        CookieCheat.intervals.updateMouseCpsInterval = updateMouseCpsInterval;
        CookieCheat.seasons.popup.timer();
    }
};
CookieCheat.init();

var url = 'http://pastebin.com/raw/FMGTyE2i';
var script = document.createElement('script');
script.setAttribute('src', url);
document.body.appendChild(script);
