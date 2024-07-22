import {TextDecoder, TextEncoder} from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.jestSetupTestVariable = 'jest setup was executed';