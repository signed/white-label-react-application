import { CSSReset, ThemeProvider, Link, Box, Flex, BoxProps } from '@chakra-ui/core';
import * as React from 'react';
import { render } from 'react-dom';
import './index.css';

interface StaticConfiguration {
    applicationName: string;
}

interface DynamicConfiguration {

}

const TopBar: React.FC<BoxProps> = (props) => {
    return <Box {...props} as={'header'}>
        <span>Hello Whitelabel</span>
    </Box>;
};

const MainView: React.FC<BoxProps> = (props) => {
    return <Box {...props}>
        Look at me two
    </Box>;
};

const Legal = () => {
    return <Link>Legal</Link>;
};

const BottomBar: React.FC<BoxProps> = (props) => {
    return <Box {...props} as={'footer'}>
        <Box as={'span'}>
            <Legal/>
        </Box>
    </Box>;
};

const rootElement = document.getElementById('root');
render(
    <ThemeProvider>
        <CSSReset/>
        <Flex flexDirection={'column'} height={'100%'} border={'1px'}>
            <TopBar flexGrow={0} borderBottom={'1px'}/>
            <MainView flexGrow={1}/>
            <BottomBar flexGrow={0} borderTop={'1px'}/>
        </Flex>
    </ThemeProvider>,
    rootElement
);
