
using from './bookshop/annotations';

annotate CatalogService.Books with {

    ID                      @(title : '{i18n>prodid}');
    title                   @(title : '{i18n>title}');
    stock                   @(title : '{i18n>stck}');

} ;

annotate CatalogService.Books with @(UI : {
    SelectionFields : [
        ID
    ],
    LineItem        : [
        {
            Value : ID,
            Label : '{i18n>prodid}'
        },
        {
            Value : title,
            Label : '{i18n>title}'

        },
        {
            Value : stock,
            Label : '{i18n>stck}'
        }
        
    ]
});
