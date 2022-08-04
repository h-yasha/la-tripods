interface Classes {
    [Class: string]: {
        skills: {
            [skill: string]: {
                label: string;
                tripods: {
                    [tripod: string]: {
                        label: string;
                        canLevel: boolean;
                    };
                };
            };
        };
    };
}

export default {
    deathBlade: {
        label: "Death Blade",
        skills: {
            soulAbsorber: {
                label: "Soul Absorber",
                tripods: {
                    fistOfDarkness: {
                        label: "Fist of Darkness",
                        canLevel: true,
                    },
                    voidZone: {
                        label: "Void Zone",
                        canLevel: true,
                    },
                },
            },
            moonlightSonic: {
                label: "Moonlight Sonic",
                tripods: {
                    fistOfDarkness: {
                        label: "Fist of Darkness",
                        canLevel: true,
                    },
                    sustainEnhancement: {
                        label: "Sustain Enhancement",
                        canLevel: true,
                    },
                },
            },
        },
    },
} as Classes;
