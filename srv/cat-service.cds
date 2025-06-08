using my.bookshop as my from '../db/schema';

service CatalogService {
    entity Books as projection on my.Books;




    type MarkRead{
        ID : Integer;
        title  : String;
        FlagRead : String;
    }

    type EmailNoti{
        item: String;
        quantity: Integer;
        price: String;

    }

    action UpdateReadMark(PostingData : array of MarkRead)             returns String;
    action NewBookPost(PostingData : LargeString)                      returns String;
    action sendOrderSummary(email: String, userName: String, items: array of EmailNoti) returns String;
}
