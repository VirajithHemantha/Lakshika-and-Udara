// Single source of truth for every wedding detail shown on the site and in the admin page.
export const WEDDING = {
  bride: {
    name: 'Lakshika',
    father: 'Mr. L.P. Siripala',
    mother: 'Mrs. K.A. Irangani Shriyalatha',
  },
  groom: {
    name: 'Udara',
    father: 'Mr. U.D. Wickramasiri Gunarathna',
    mother: 'Mrs. D.G. Chandrika Dodangoda',
  },
  // Sri Lanka time (UTC+05:30)
  dateISO: '2027-01-28T09:30:00+05:30',
  dateLong: 'Thursday, 28th January',
  yearWords: 'The Year Two Thousand Twenty Seven',
  dateShort: '28 . 01 . 2027',
  monthYear: 'January 2027',
  dateFooter: 'January 28, 2027',
  startTime: '09:00 AM',
  endTime: '03:00 PM',
  poruwaTime: '09:30 AM',
  venue: {
    name: 'Kolonne Riverside Garden Hotel',
    address: 'Thalduwa, Avissawella',
    mapUrl: 'https://maps.app.goo.gl/Qkdtbor8QjU5jQYe9',
    embedUrl: 'https://www.google.com/maps?q=Kolonne+Riverside+Garden+Hotel,+Thalduwa,+Avissawella&output=embed',
  },
  phones: ['0717232621', '0718989962'],
} as const;

export const COUPLE_NAMES = `${WEDDING.groom.name} & ${WEDDING.bride.name}`;
