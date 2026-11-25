export interface Destination {
    id: string;
    name: string;
    categoryEs: string;
    categoryEn: string;
    descriptionEs: string;
    descriptionEn: string;
    url: string;
    source: string;
    author: string;
    license: string;
    lat: number;
    lon: number;
    alt: string;
}
export const destinations: Destination[] = [
    {
        id: 'campeche',
        name: 'San Francisco de Campeche',
        categoryEs: 'Historia y arquitectura',
        categoryEn: 'History and architecture',
        descriptionEs: 'Entre calles de colores y antiguas murallas, Campeche conserva siglos de historia frente al Golfo de México.',
        descriptionEn: 'Among colorful streets and ancient walls, Campeche preserves centuries of history facing the Gulf of Mexico.',
        url: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Old_City_Walls_and_Colonial_Facades_-_Campeche_-_Mexico.jpg',
        source: 'https://commons.wikimedia.org/wiki/File:Old_City_Walls_and_Colonial_Facades_-_Campeche_-_Mexico.jpg',
        author: 'Adam Jones, Ph.D.',
        license: '3.0',
        lat: 19.8456,
        lon: -90.5369,
        alt: 'Calles coloniales y murallas de San Francisco de Campeche'
    },
    {
        id: 'edzna',
        name: 'Edzná',
        categoryEs: 'Patrimonio maya',
        categoryEn: 'Maya heritage',
        descriptionEs: 'Una antigua ciudad maya donde la arquitectura y la memoria revelan la grandeza de una civilización.',
        descriptionEn: 'An ancient Maya city where architecture and memory reveal the greatness of a civilization.',
        url: 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Edzna_Archaeological_Site_with_Flash_-_Campeche_State_-_Mexico.jpg',
        source: 'https://commons.wikimedia.org/wiki/File:Edzna_Archaeological_Site_with_Flash_-_Campeche_State_-_Mexico.jpg',
        author: 'Adam Jones, Ph.D.',
        license: '3.0',
        lat: 19.5983,
        lon: -90.2292,
        alt: 'Edificio de los Cinco Pisos en la zona arqueológica de Edzná'
    },
    {
        id: 'calakmul',
        name: 'Calakmul',
        categoryEs: 'Naturaleza y cultura',
        categoryEn: 'Nature and culture',
        descriptionEs: 'En el corazón de la selva, Calakmul guarda historias de una de las grandes ciudades del mundo maya.',
        descriptionEn: 'In the heart of the jungle, Calakmul holds stories of one of the great cities of the Maya world.',
        url: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Calakmul_Structure_2.jpg',
        source: 'https://commons.wikimedia.org/wiki/File:Calakmul_Structure_2.jpg',
        author: 'Lugares INAH',
        license: '4.0',
        lat: 18.1056,
        lon: -89.8108,
        alt: 'Pirámide maya en la reserva de Calakmul'
    },
    {
        id: 'isla',
        name: 'Isla Aguada',
        categoryEs: 'Vida costera',
        categoryEn: 'Coastal life',
        descriptionEs: 'Un rincón donde el agua, la naturaleza y las tradiciones costeras marcan el ritmo de la vida.',
        descriptionEn: 'A place where water, nature and coastal traditions set the rhythm of life.',
        url: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Colorful_Sea_Side_-_Isla_Aguada_Campeche.jpg',
        source: 'https://commons.wikimedia.org/wiki/File:Colorful_Sea_Side_-_Isla_Aguada_Campeche.jpg',
        author: 'Bernard DUPONT',
        license: '2.0',
        lat: 18.7833,
        lon: -91.4833,
        alt: 'Costa y aguas de Isla Aguada, Campeche'
    }
    ,{
    id: 'becal',
    name: 'Bécal',
    categoryEs: 'Tradición artesanal',
    categoryEn: 'Artisan traditions',
    descriptionEs: 'Una tierra de artesanos donde el tejido de jipi-japa mantiene viva una tradición transmitida entre generaciones.',
    descriptionEn: 'A land of artisans where traditional jipi-japa weaving preserves a heritage passed down through generations.',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/B%C3%A9cal.jpg',
    source: 'https://commons.wikimedia.org/wiki/File:B%C3%A9cal.jpg',
    author: 'Cesarloar',
    license: '4.0',
    lat: 20.4426,
    lon: -90.0282,
    alt: 'Monumento tradicional de Bécal, Campeche'
},
{
    id: 'hecelchakan',
    name: 'Hecelchakán',
    categoryEs: 'Identidad y patrimonio',
    categoryEn: 'Identity and heritage',
    descriptionEs: 'En el corazón del Camino Real, Hecelchakán conserva sus tradiciones, su arquitectura y la memoria de su gente.',
    descriptionEn: 'In the heart of the Camino Real, Hecelchakán preserves its traditions, architecture and community heritage.',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Plaza_principal_de_Hecelchak%C3%A1n.jpg',
    source: 'https://commons.wikimedia.org/wiki/File:Plaza_principal_de_Hecelchak%C3%A1n.jpg',
    author: 'Josemiep',
    license: '4.0',
    lat: 20.1783,
    lon: -90.1344,
    alt: 'Plaza principal de Hecelchakán'
},
{
    id: 'palizada',
    name: 'Palizada',
    categoryEs: 'Historias junto al río',
    categoryEn: 'Riverside stories',
    descriptionEs: 'Entre portales, tejados tradicionales y paisajes junto al río, Palizada conserva una identidad única.',
    descriptionEn: 'Among traditional rooftops, historic arcades and riverside landscapes, Palizada preserves its unique identity.',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Portales_Palizada_Campeche_-_panoramio.jpg',
    source: 'https://commons.wikimedia.org/wiki/File:Portales_Palizada_Campeche_-_panoramio.jpg',
    author: 'panza.rayada',
    license: '3.0',
    lat: 18.2544,
    lon: -92.0908,
    alt: 'Portales tradicionales de Palizada, Campeche'
}
];
