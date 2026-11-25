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
];
