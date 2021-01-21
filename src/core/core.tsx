import { Box, BoxProps, CSSReset, Flex, Image, Link, Text, ChakraProvider } from '@chakra-ui/react';
import { useContext } from 'react';
import * as React from 'react';
import { BasicExtensionPoint, ExtensionRegistry, useExtensionRegistry } from '../extension-api/extension-registry';

export interface StaticConfiguration {
    applicationName: string;
}

export const StaticConfiguration = React.createContext<StaticConfiguration | undefined>(undefined);
export const useStaticConfiguration = (): StaticConfiguration => {
    const mayBe = useContext(StaticConfiguration);
    if (mayBe === undefined) {
        throw new Error('Add a StaticConfiguration.Provider to the parent of the calling component');
    }
    return mayBe;
};

const TopBar: React.FC<BoxProps> = (props) => {
    const { applicationName } = useStaticConfiguration();
    return <Box {...props} as={'header'}>
        <span>Welcome to {applicationName}</span>
    </Box>;
};

const Legal = () => {
    return <Link>Legal</Link>;
};

export type BottomBarExtensionContext = { element: () => JSX.Element }
export const bottomBarExtension = BasicExtensionPoint.ofType<BottomBarExtensionContext>('BottomBarItem');
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

export type MainViewContentContext = {
    imageUrl: string,
    caption: string,
    alt: string
}
export const mainViewContentExtension = BasicExtensionPoint.ofType<MainViewContentContext>('MainViewContent');

const MainView: React.FC<BoxProps> = (props) => {
    const extensions = useExtensionRegistry().extensionsFor(mainViewContentExtension);
    if (extensions.length > 1) {
        throw new Error('only one mainViewContentExtension allowed');
    }
    const extension = extensions[0] ?? {
        alt: 'nothing here',
        caption: 'Messier 87',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Black_hole_-_Messier_87_crop_max_res.jpg'
    };
    return <Box as={'main'} {...props}>
        <Flex direction={'column'} alignItems={'center'}>
            <Image flexGrow={0} src={extension.imageUrl} height={'80vh'}/>
            <Text>{extension.caption}</Text>
        </Flex>
    </Box>;
};


export type SupportedLanguage = 'EN' | 'DE';

export interface DynamicConfiguration {
    language: SupportedLanguage;
}

export const createBrandedExperience = (registry: ExtensionRegistry) => {
    return (_config: DynamicConfiguration) => {
        return <ExtensionRegistry.Provider value={registry}>
            <ChakraProvider>
                <CSSReset/>
                <Flex flexDirection={'column'} height={'100%'} border={'1px'} flexGrow={1}>
                    <TopBar flexGrow={0} borderBottom={'1px'}/>
                    <MainView flexGrow={1}/>
                    <BottomBar flexGrow={0} borderTop={'1px'}/>
                </Flex>
            </ChakraProvider>
        </ExtensionRegistry.Provider>;
    };
};
