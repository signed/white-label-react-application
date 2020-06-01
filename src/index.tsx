import { Box, BoxProps, CSSReset, Flex, Link, ThemeProvider } from '@chakra-ui/core';
import * as React from 'react';
import { useContext } from 'react';
import { render } from 'react-dom';
import { BasicExtensionPoint, DefaultExtensionRegistry, ExtensionRegistry, useExtensionRegistry } from './extension-api/extension-registry';
import './index.css';

export interface StaticConfiguration {
    applicationName: string;
}

export const StaticConfiguration = React.createContext<StaticConfiguration|undefined>(undefined);

export const useStaticConfiguration = (): StaticConfiguration => {
    const mayBe = useContext(StaticConfiguration);
    if (mayBe === undefined) {
        throw new Error('Add a StaticConfiguration.Provider to the parent of the calling component');
    }
    return mayBe;
};

type SupportedLanguage = 'EN' | 'DE';

interface DynamicConfiguration {
    language: SupportedLanguage;
}

const TopBar: React.FC<BoxProps> = (props) => {
    const { applicationName } = useStaticConfiguration();
    return <Box {...props} as={'header'}>
        <span>Welcome to {applicationName}</span>
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

const Contact = () => {
    return <Link>Send us a mail</Link>;
};
const TermsOfUse = () => {
    return <Link>Terms of Use</Link>;
};
const PrivacyPolicy = () => {
    return <Link>Privacy Policy</Link>;
};


type BottomBarExtensionContext = { element: () => JSX.Element }

const bottomBarExtension = BasicExtensionPoint.ofType<BottomBarExtensionContext>('BottomBarItem');

const BottomBar: React.FC<BoxProps> = (props) => {
    const registry = useExtensionRegistry();
    return <Box {...props} as={'footer'}>
        <Flex justifyContent={'space-around'}>
            {registry.extensionsFor(bottomBarExtension)
                .map(extension => {
                    return <extension.element/>;
                })}
            <Legal/>
        </Flex>
    </Box>;
};

const createBrandedExperience = (registry: ExtensionRegistry) => {
    return (_config: DynamicConfiguration) => {
        return <ExtensionRegistry.Provider value={registry}>
            <ThemeProvider>
                <CSSReset/>
                <Flex flexDirection={'column'} height={'100%'} border={'1px'} flexGrow={1}>
                    <TopBar flexGrow={0} borderBottom={'1px'}/>
                    <MainView flexGrow={1}/>
                    <BottomBar flexGrow={0} borderTop={'1px'}/>
                </Flex>
            </ThemeProvider>
        </ExtensionRegistry.Provider>;
    };
};



const romulus = () => {
    const config: StaticConfiguration = {
        applicationName: 'Romulus'
    };
    const registry = new DefaultExtensionRegistry();
    registry.register(bottomBarExtension.implementWith({ element: TermsOfUse }));
    registry.register(bottomBarExtension.implementWith({ element: PrivacyPolicy }));
    registry.register(bottomBarExtension.implementWith({ element: Contact }));
    const BrandedComponent = createBrandedExperience(registry);
    const dynamicConfiguration: DynamicConfiguration = { language: 'EN' };
    return <StaticConfiguration.Provider value={config}>
        <BrandedComponent {...dynamicConfiguration}/>
    </StaticConfiguration.Provider>;
};

const remus = () => {
    const config: StaticConfiguration = {
        applicationName: 'Remus'
    };

    const RemusShows = () => {
        return <Link>Remus Shows</Link>;
    };


    const registry = new DefaultExtensionRegistry();
    registry.register(bottomBarExtension.implementWith({ element: RemusShows }));
    registry.register(bottomBarExtension.implementWith({ element: Contact }));
    const BrandedComponent = createBrandedExperience(registry);
    const dynamicConfiguration: DynamicConfiguration = { language: 'EN' };
    return <StaticConfiguration.Provider value={config}>
        <BrandedComponent {...dynamicConfiguration}/>
    </StaticConfiguration.Provider>;
};

const Romulus = romulus();
const Remus = remus();

const rootElement = document.getElementById('root');

render(
    <Flex direction={'row'} height={'100%'} width={'100%'} justifyContent={'space-between'}>
        {Romulus}
        {Remus}
    </Flex>,

    rootElement
);
