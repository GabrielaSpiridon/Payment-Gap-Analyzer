from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework import status
import pandas as pd
import MySQLdb

from analysis.handlers import handler_map

@api_view(['POST'])
@parser_classes([MultiPartParser])
def upload_excel(request):
    if 'files' not in request.FILES and 'file' not in request.FILES:
        return Response({'error': 'No files uploaded.'}, status=status.HTTP_400_BAD_REQUEST)

    files = request.FILES.getlist('files') or request.FILES.getlist('file')
    results = []

    try:
        conn = MySQLdb.connect(
            host="localhost",
            user="root",
            passwd="gabriela2003",
            db="payment_gap_db",
        )
        cursor = conn.cursor()

        for file_obj in files:
            table_name = file_obj._name.split('.')[0].lower()
            try:
                df = pd.read_excel(file_obj)

                if table_name in handler_map:
                    inserted = handler_map[table_name](df, cursor)
                    results.append({
                        'fileName': file_obj.name,
                        'status': 'success',
                        'rowsInserted': inserted
                    })
                else:
                    results.append({
                        'fileName': file_obj.name,
                        'status': 'failed',
                        'message': f'Table `{table_name}` not supported.'
                    })

            except Exception as e:
                results.append({
                    'fileName': file_obj.name,
                    'status': 'failed',
                    'message': str(e)
                })

        success = any(r['status'] == 'success' for r in results)
        if success:
            conn.commit()
        else:
            conn.rollback()

        cursor.close()
        conn.close()

        return Response({'results': results}, status=status.HTTP_200_OK if success else status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({'error': f'Processing error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
